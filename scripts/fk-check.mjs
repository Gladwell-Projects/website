#!/usr/bin/env node
/**
 * @file fk-check.mjs — Post-migration foreign-key integrity gate for D1, and a
 * tiny shared D1 helper library (imported by {@link ./heal-orphans.mjs}).
 *
 * Why this exists: D1 silently IGNORES `PRAGMA foreign_keys=OFF`, but drizzle-kit's
 * auto-generated "12-step table rebuild" migrations wrap themselves in exactly
 * that no-op. So a rebuild can strand references (dangling FK rows) without any
 * error at migrate time — the failure only shows up later (e.g. a stage-pull
 * `FOREIGN KEY constraint failed`). This is unfixed upstream as of adapter
 * 3.85.1 (drizzle-kit emits the pattern; see payloadcms/payload#16644), so this
 * gate is the backstop: run `PRAGMA foreign_key_check` after every migrate and
 * fail loudly the moment an orphan appears.
 *
 * Usage:
 *   node scripts/fk-check.mjs --db website            # prod
 *   node scripts/fk-check.mjs --db website-staging    # staging
 * Exit code: 0 = clean, 1 = violations found, 2 = bad invocation.
 */
import { execFileSync } from 'node:child_process'

const MAX_BUFFER = 1 << 28 // 256MB

/**
 * Run wrangler (via `pnpm exec`), returning stdout.
 * @param {string[]} args - wrangler arguments.
 * @param {import('node:child_process').ExecFileSyncOptions} [opts]
 * @returns {string}
 */
export function wrangler(args, opts = {}) {
  return execFileSync('pnpm', ['exec', 'wrangler', ...args], {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    ...opts,
  })
}

/**
 * Execute a single SQL statement against a remote D1 database and return its
 * rows. Normalizes wrangler's `--json` shape (`[{ results }]`).
 * @param {string} db - D1 database name (e.g. `website`, `website-staging`).
 * @param {string} sql - A single SQL statement.
 * @returns {Array<Record<string, unknown>>}
 */
export function query(db, sql) {
  const out = wrangler(['d1', 'execute', db, '--remote', '--json', '--command', sql])
  const d = JSON.parse(out)
  return (Array.isArray(d) ? d[0]?.results : d.results) || []
}

/**
 * The complete list of dangling foreign-key rows in a database.
 * @param {string} db - D1 database name.
 * @returns {Array<{ table: string, rowid: number, parent: string, fkid: number }>}
 */
export function foreignKeyViolations(db) {
  return /** @type {any} */ (query(db, 'PRAGMA foreign_key_check;'))
}

/**
 * Group violations by `child → parent` for a compact human summary.
 * @param {Array<{ table: string, parent: string }>} rows
 * @returns {string}
 */
export function summarize(rows) {
  const counts = new Map()
  for (const r of rows) {
    const key = `${r.table} → ${r.parent}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return [...counts.entries()].map(([key, n]) => `  ${String(n).padStart(3)}×  ${key}`).join('\n')
}

function dbArg() {
  const i = process.argv.indexOf('--db')
  return i !== -1 ? process.argv[i + 1] : null
}

// CLI entry — only when run directly, not when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  const db = dbArg()
  if (!db) {
    console.error('fk-check: --db <name> is required (e.g. --db website)')
    process.exit(2)
  }
  const rows = foreignKeyViolations(db)
  if (rows.length === 0) {
    console.log(`✓ FK check clean on "${db}" — no dangling references.`)
    process.exit(0)
  }
  console.error(`✗ FK check FAILED on "${db}": ${rows.length} dangling reference(s):\n${summarize(rows)}`)
  console.error(`\nInspect/heal with:  node scripts/heal-orphans.mjs --db ${db}`)
  process.exit(1)
}
