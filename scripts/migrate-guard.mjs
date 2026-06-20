#!/usr/bin/env node
/**
 * @file migrate-guard.mjs — Wrap a D1 `payload migrate` with a before/after
 * safety net, because D1 ignores `PRAGMA foreign_keys=OFF` and drizzle-kit's
 * table-rebuild migrations therefore `DROP TABLE` with FKs live — doing an
 * implicit cascading DELETE that silently removes owned/referencing rows. The
 * post-migrate `fk-check` CANNOT catch that (no dangling ref is left behind),
 * so this guard catches it the only way left: by row count.
 *
 * Two phases, run either side of `payload migrate`:
 *   --pre   Capture the current Time Travel bookmark + every content table's row
 *           count to a sidecar file. Prints the bookmark (your one-command undo).
 *   --post  Re-count and compare. ANY table that LOST rows fails the gate (exit 1)
 *           and prints the exact `time-travel restore` command to undo the migrate.
 *           Row growth is fine. Use --allow-drop for an intentionally row-removing
 *           migration.
 *
 * Usage (chained in package.json around `payload migrate`):
 *   node scripts/migrate-guard.mjs --db website --pre
 *   …payload migrate…
 *   node scripts/migrate-guard.mjs --db website --post
 *
 * Exit: 0 = ok, 1 = rows dropped (gate tripped) or bad state, 2 = bad invocation.
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { query } from './fk-check.mjs'

const arg = (flag) => {
  const i = process.argv.indexOf(flag)
  return i !== -1 ? process.argv[i + 1] : null
}
const db = arg('--db')
const PRE = process.argv.includes('--pre')
const POST = process.argv.includes('--post')
const ALLOW_DROP = process.argv.includes('--allow-drop')

// Tables whose counts legitimately change during a migrate or are ephemeral —
// excluded so they never trip (or mask) the gate. Mirrors the stage-pull/verify
// DENY intent, plus payload_migrations (migrate writes a row here by design).
const DENY = new Set([
  'payload_migrations',
  'users_sessions',
  'clients_sessions',
  'payload_locked_documents',
  'payload_locked_documents_rels',
  'payload_preferences',
  'payload_preferences_rels',
  'payload_query_presets',
  'payload_query_presets_rels',
])

const UNION_CHUNK = 5 // D1's compound-SELECT term limit is very low

if (!db || (!PRE && !POST) || (PRE && POST)) {
  console.error('migrate-guard: usage: --db <name> (--pre | --post) [--allow-drop]')
  process.exit(2)
}
if (!/^[\w-]+$/.test(db)) {
  console.error(`migrate-guard: refusing suspicious --db value: ${db}`)
  process.exit(2)
}

const sidecar = join(tmpdir(), `migrate-guard-${db}.json`)

/** Current Time Travel bookmark for `db` (the one-command undo point). */
function currentBookmark() {
  try {
    const out = execSync(`pnpm exec wrangler d1 time-travel info ${db} 2>&1`, {
      encoding: 'utf8',
      maxBuffer: 1 << 26,
    })
    const m = out.match(/current bookmark is '([^']+)'/i)
    return m ? m[1] : null
  } catch {
    return null
  }
}

/** Every non-DENY content table → row count (chunked to respect D1's limits). */
function countAll() {
  const tables = query(
    db,
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY name;",
  )
    .map((r) => r.name)
    .filter((t) => !DENY.has(t))

  const counts = {}
  for (let i = 0; i < tables.length; i += UNION_CHUNK) {
    const chunk = tables.slice(i, i + UNION_CHUNK)
    const sql = chunk.map((t) => `SELECT '${t}' AS name, count(*) AS c FROM "${t}"`).join(' UNION ALL ')
    for (const r of query(db, sql)) counts[r.name] = Number(r.c)
  }
  return counts
}

if (PRE) {
  const bookmark = currentBookmark()
  const counts = countAll()
  writeFileSync(sidecar, JSON.stringify({ db, bookmark, counts }, null, 2))
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  console.log(`migrate-guard: baseline for "${db}" — ${Object.keys(counts).length} tables, ${total} rows.`)
  console.log(`migrate-guard: pre-migrate bookmark (undo point): ${bookmark ?? '(unavailable)'}`)
  process.exit(0)
}

// --post
if (!existsSync(sidecar)) {
  console.warn(`migrate-guard: no baseline at ${sidecar} (was --pre run?) — skipping count gate.`)
  process.exit(0)
}
const base = JSON.parse(readFileSync(sidecar, 'utf8'))
const after = countAll()
const drops = []
for (const [t, before] of Object.entries(base.counts)) {
  const now = after[t] ?? 0
  if (now < before) drops.push({ table: t, before, now, delta: now - before })
}

if (drops.length === 0) {
  console.log(`migrate-guard: ✓ no row-count drops on "${db}" — migrate looks clean.`)
  rmSync(sidecar, { force: true })
  process.exit(0)
}

drops.sort((a, b) => a.delta - b.delta)
console.error(`migrate-guard: ✗ ${drops.length} table(s) LOST rows after migrate on "${db}":`)
for (const d of drops) console.error(`  ${d.table.padEnd(34)} ${d.before} → ${d.now}  (${d.delta})`)
console.error(
  `\nThis is the silent-cascade signature (D1 ignores foreign_keys=OFF on table rebuilds).` +
    `\nIf intentional, re-run the deploy with --allow-drop. Otherwise UNDO the migrate:`,
)
console.error(
  base.bookmark
    ? `  pnpm exec wrangler d1 time-travel restore ${db} --bookmark=${base.bookmark}`
    : `  (no pre-migrate bookmark was captured — check Time Travel manually)`,
)
if (ALLOW_DROP) {
  console.error('\nmigrate-guard: --allow-drop set — not failing the gate.')
  rmSync(sidecar, { force: true })
  process.exit(0)
}
process.exit(1)
