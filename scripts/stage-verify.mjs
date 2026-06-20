#!/usr/bin/env node
/**
 * @file stage-verify.mjs — Compare per-table row counts between prod and the
 * staging D1 to confirm a {@link file://./stage-pull.mjs} refresh landed.
 * Counts every content table (same DENY set as stage-pull) and reports any
 * mismatches. Run via `pnpm run stage:verify`.
 *
 * Efficiency: instead of one query per table per DB, it builds
 * `SELECT '<t>' AS name, count(*) AS c FROM "<t>" UNION ALL …` queries and runs
 * them against each database. The union is chunked ({@link UNION_CHUNK}) because
 * D1 caps the number of terms in a compound SELECT.
 */

import { execFileSync } from 'node:child_process'

const PROD = 'website'
const STAGING = 'website-staging'

// Mirror of stage-pull.mjs DENY — tables that are intentionally NOT copied, so
// we don't flag them as "mismatches". Keep in sync with stage-pull.mjs.
const DENY = new Set([
  'users', 'users_sessions',
  'clients', 'clients_sessions',
  'contact_submissions',
  'payload_migrations',
  'payload_locked_documents', 'payload_locked_documents_rels',
  'payload_preferences', 'payload_preferences_rels',
  'payload_query_presets', 'payload_query_presets_rels',
])

/**
 * Run a read-only SQL command and return its rows.
 * @param {string} db - D1 database name.
 * @param {string} sql - A single SQL statement.
 * @returns {Array<Record<string, unknown>>} Result rows.
 */
function query(db, sql) {
  const out = execFileSync(
    'pnpm',
    ['exec', 'wrangler', 'd1', 'execute', db, '--remote', '--json', '--command', sql],
    { encoding: 'utf8', maxBuffer: 1 << 28 },
  )
  const d = JSON.parse(out)
  return (Array.isArray(d) ? d[0]?.results : d.results) || []
}

const UNION_CHUNK = 5 // D1's compound-SELECT term limit is very low (5 ok, 8 fails)

/**
 * Count every content table, batching the UNION into {@link UNION_CHUNK}-table
 * queries to respect D1's compound-SELECT limit.
 * @param {string} db - D1 database name.
 * @param {string[]} tables - Content table names.
 * @returns {Map<string, number>} table → row count.
 */
function countAll(db, tables) {
  const counts = new Map()
  for (let i = 0; i < tables.length; i += UNION_CHUNK) {
    const chunk = tables.slice(i, i + UNION_CHUNK)
    const sql = chunk.map((t) => `SELECT '${t}' AS name, count(*) AS c FROM "${t}"`).join(' UNION ALL ')
    for (const r of query(db, sql)) counts.set(r.name, Number(r.c))
  }
  return counts
}

const tables = query(
  PROD,
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY name;",
)
  .map((r) => r.name)
  .filter((t) => !DENY.has(t))

const prod = countAll(PROD, tables)
const staging = countAll(STAGING, tables)

let mismatches = 0
let prodTotal = 0
let stagingTotal = 0
for (const t of tables) {
  const p = prod.get(t) ?? 0
  const s = staging.get(t) ?? 0
  prodTotal += p
  stagingTotal += s
  if (p !== s) {
    mismatches++
    console.log(`  MISMATCH  ${t}: prod=${p} staging=${s}`)
  }
}

console.log(`\nContent tables checked: ${tables.length}`)
console.log(`Prod total rows:    ${prodTotal}`)
console.log(`Staging total rows: ${stagingTotal}`)
if (mismatches === 0) {
  console.log('\n✓ Staging matches prod on every content table.')
} else {
  console.log(`\n✗ ${mismatches} table(s) differ (see above).`)
  process.exit(1)
}
