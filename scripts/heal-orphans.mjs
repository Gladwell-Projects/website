#!/usr/bin/env node
/**
 * @file heal-orphans.mjs — Find and repair dangling foreign-key rows in a D1 db.
 *
 * Uses `PRAGMA foreign_key_check` (the complete, schema-driven orphan list — not
 * a hand-maintained field list) and applies a PER-CONSTRAINT remediation:
 *   • setNull — NULL the offending FK column. Matches the `ON DELETE set null`
 *     the rebuild migration should have fired; render already ghosts/drops these.
 *   • delete  — remove the row entirely. For system join-tables whose parent is
 *     gone (e.g. stale admin edit-locks), where nulling makes no sense.
 *   • (unmapped) — REPORT ONLY. Never guesses a destructive action.
 *
 * Default run is a DRY PREVIEW. Pass `--apply` to write; it re-runs the FK check
 * afterward to confirm zero remain.
 *
 * Usage:
 *   node scripts/heal-orphans.mjs --db website-staging                 # preview
 *   node scripts/heal-orphans.mjs --db website-staging --apply         # heal
 *   node scripts/heal-orphans.mjs --db website --apply --prod-confirm  # heal prod
 *
 * Prod writes require the extra `--prod-confirm` flag (the dry run never does).
 */
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { wrangler, query, foreignKeyViolations, summarize } from './fk-check.mjs'

const APPLY = process.argv.includes('--apply')
const PROD_CONFIRM = process.argv.includes('--prod-confirm')
const db = (() => {
  const i = process.argv.indexOf('--db')
  return i !== -1 ? process.argv[i + 1] : null
})()

/**
 * Per-constraint remediation, keyed by the CHILD table holding the bad row.
 * Anything not listed is reported but never modified.
 * @type {Record<string, 'setNull' | 'delete'>}
 */
const REMEDIATION = {
  _press_v: 'setNull', // version snapshot → deleted media: null the upload column
  _press_v_version_links: 'setNull', // version rich-text link → deleted media upload
  payload_locked_documents_rels: 'delete', // stale admin edit-lock join row → remove
}

/**
 * Resolve the child column backing a given foreign key (the `fkid` index from
 * `foreign_key_check`) via `PRAGMA foreign_key_list`.
 * @param {string} table
 * @param {number} fkid
 * @param {Map<string, string|null>} cache
 * @returns {string | null}
 */
function fkColumn(table, fkid, cache) {
  const key = `${table}:${fkid}`
  if (!cache.has(key)) {
    const fks = query(db, `PRAGMA foreign_key_list("${table}");`)
    const match = fks.find((f) => Number(f.id) === Number(fkid))
    cache.set(key, (match && /** @type {any} */ (match).from) || null)
  }
  return cache.get(key) ?? null
}

function main() {
  if (!db) {
    console.error('heal-orphans: --db <name> is required (e.g. --db website-staging)')
    process.exit(2)
  }

  const rows = foreignKeyViolations(db)
  if (rows.length === 0) {
    console.log(`✓ "${db}": no dangling references; nothing to heal.`)
    process.exit(0)
  }

  console.log(`Dangling references on "${db}": ${rows.length}\n${summarize(rows)}\n`)

  /** @type {Array<{ sql: string, label: string }>} */
  const stmts = []
  /** @type {Array<{ table: string, rowid: number, parent: string, fkid: number, why: string }>} */
  const unhandled = []
  const colCache = new Map()

  for (const r of rows) {
    const action = REMEDIATION[r.table]
    const rowid = Number(r.rowid)
    if (action === 'delete') {
      stmts.push({ sql: `DELETE FROM "${r.table}" WHERE rowid = ${rowid};`, label: `delete ${r.table}` })
    } else if (action === 'setNull') {
      const col = fkColumn(r.table, r.fkid, colCache)
      if (!col) {
        unhandled.push({ ...r, why: `could not resolve FK column for fkid ${r.fkid}` })
        continue
      }
      stmts.push({
        sql: `UPDATE "${r.table}" SET "${col}" = NULL WHERE rowid = ${rowid};`,
        label: `setNull ${r.table}.${col}`,
      })
    } else {
      unhandled.push({ ...r, why: 'no remediation rule (report-only)' })
    }
  }

  // Plan summary, grouped by action.
  const byLabel = new Map()
  for (const s of stmts) byLabel.set(s.label, (byLabel.get(s.label) || 0) + 1)
  console.log('Planned remediation:')
  for (const [label, n] of byLabel) console.log(`  ${String(n).padStart(3)}×  ${label}`)
  if (unhandled.length) {
    console.log(`\n⚠ ${unhandled.length} UNHANDLED (left untouched — review manually):`)
    for (const u of unhandled) {
      console.log(`  ${u.table} rowid=${u.rowid} → ${u.parent} (fkid ${u.fkid}) — ${u.why}`)
    }
  }

  if (!APPLY) {
    console.log(`\nDRY RUN — no changes written. Re-run with --apply to heal the ${stmts.length} row(s) above.`)
    process.exit(unhandled.length ? 1 : 0)
  }

  // Extra gate for prod writes: the dry run above is always safe, but applying
  // against the live `website` db needs a deliberate second flag so it can't
  // happen by reflex or from a mistyped command.
  if (db === 'website' && !PROD_CONFIRM) {
    console.error(
      `\nRefusing to --apply against prod ("website") without --prod-confirm.` +
        `\nReview the dry run above, then re-run: node scripts/heal-orphans.mjs --db website --apply --prod-confirm`,
    )
    process.exit(2)
  }

  if (stmts.length === 0) {
    console.log('\nNothing to apply (all violations are unhandled/report-only).')
    process.exit(1)
  }

  // Apply as a single file so it runs in one wrangler invocation.
  const file = join(tmpdir(), `heal-orphans-${db}.sql`)
  writeFileSync(file, stmts.map((s) => s.sql).join('\n') + '\n')
  console.log(`\nApplying ${stmts.length} statement(s) to "${db}"…`)
  wrangler(['d1', 'execute', db, '--remote', '--yes', '--file', file], {
    stdio: ['ignore', 'inherit', 'inherit'],
  })

  const after = foreignKeyViolations(db)
  if (after.length === 0) {
    console.log(`\n✓ Healed. "${db}" now has zero dangling references.`)
    process.exit(0)
  }
  console.error(`\n✗ ${after.length} violation(s) remain (unhandled or new):\n${summarize(after)}`)
  process.exit(1)
}

main()
