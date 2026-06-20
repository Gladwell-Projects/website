#!/usr/bin/env node
/**
 * @file stage-pull.mjs — Refresh the isolated staging D1 with prod CONTENT,
 * PII-free and on demand. Run via `pnpm run stage:pull` (preview) /
 * `pnpm run stage:pull:apply` (apply).
 *
 * How it works:
 *  1. Discover content tables from prod's `sqlite_master` (everything except the
 *     {@link DENY} list), so new collections are picked up automatically.
 *  2. Read each table as JSON, then emit ONE generated `.sql` file:
 *     `DELETE`s (children→parents) followed by batched `INSERT`s
 *     (parents→children), and apply it with `wrangler d1 execute --file`.
 *
 * Why the ordering matters: D1 enforces foreign keys AND splits a large `--file`
 * into multiple transactions, with FK checks enforced per-transaction. So a
 * `PRAGMA defer_foreign_keys` alone is not enough (it only spans one
 * transaction) — rows must be ordered so every referenced table is written
 * before the tables that reference it. We {@link topoSort} the tables to
 * guarantee this; `defer_foreign_keys` stays as in-chunk belt-and-suspenders.
 *
 * Why generate the SQL ourselves instead of `wrangler d1 export`: we control
 * formatting (no explicit BEGIN/COMMIT — D1 wraps it; small batched INSERTs
 * avoid "Statement too long") and escape values directly, so embedded
 * quotes/newlines/semicolons in richtext survive intact (verified).
 *
 * SAFETY:
 *  - Writes ONLY to `website-staging`; the script never issues a write to prod.
 *  - PII / ephemeral tables are never copied (see {@link DENY}).
 *  - Default run is a DRY PREVIEW (counts only); pass `--yes` to actually apply.
 *
 * Usage:
 *   node scripts/stage-pull.mjs                       # preview what would be copied
 *   node scripts/stage-pull.mjs --yes                 # apply: wipe + copy staging
 *   node scripts/stage-pull.mjs --yes --no-versions   # skip _*_v draft history
 *   node scripts/stage-pull.mjs --only artists,exhibitions [--yes]
 */

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const PROD = 'website'
const STAGING = 'website-staging' // the ONLY db this script ever writes to

const APPLY = process.argv.includes('--yes')
const NO_VERSIONS = process.argv.includes('--no-versions')
const ONLY = (() => {
  const i = process.argv.indexOf('--only')
  return i !== -1 && process.argv[i + 1] ? new Set(process.argv[i + 1].split(',')) : null
})()

// Never copy these. Auth tables (emails/hashes/salts/reset tokens), visitor
// submissions, and user-scoped / ephemeral Payload bookkeeping. Staging owns
// its own migration log.
const DENY = new Set([
  'users', 'users_sessions',
  'clients', 'clients_sessions',
  'contact_submissions',
  'payload_migrations',
  'payload_locked_documents', 'payload_locked_documents_rels',
  'payload_preferences', 'payload_preferences_rels',
  'payload_query_presets', 'payload_query_presets_rels',
])

const MAX_BUFFER = 1 << 28 // 256MB ceiling for a big `SELECT *` JSON payload
const BATCH_ROWS = 50 // max rows per multi-row INSERT
const BATCH_BYTES = 60_000 // flush a batch before it grows unwieldy in the file

/**
 * Run wrangler with the given argv (via `pnpm exec`), returning stdout.
 * @param {string[]} args - wrangler arguments, e.g. `['d1','execute',db,...]`.
 * @param {import('node:child_process').ExecFileSyncOptions} [opts] - overrides
 *   merged over the defaults (utf8 encoding, {@link MAX_BUFFER}).
 * @returns {string} The command's stdout.
 */
function wrangler(args, opts = {}) {
  return execFileSync('pnpm', ['exec', 'wrangler', ...args], {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    ...opts,
  })
}

/**
 * Execute a read-only SQL command and return its rows. Normalizes wrangler's
 * `--json` shape, which is `[{ results }]` for a single statement.
 * @param {string} db - D1 database name (binding-less name, e.g. `website`).
 * @param {string} sql - A single SQL statement.
 * @returns {Array<Record<string, unknown>>} Result rows (empty if none).
 */
function query(db, sql) {
  const out = wrangler(['d1', 'execute', db, '--remote', '--json', '--command', sql])
  const d = JSON.parse(out)
  return (Array.isArray(d) ? d[0]?.results : d.results) || []
}

/**
 * Apply a generated `.sql` file to staging. Guards against ever writing to a
 * database other than {@link STAGING}.
 * @param {string} db - Target database name; must equal {@link STAGING}.
 * @param {string} path - Path to the `.sql` file to execute.
 * @throws {Error} If `db` is not the staging database.
 */
function applyFile(db, path) {
  if (db !== STAGING) throw new Error(`refusing to write to non-staging db: ${db}`)
  wrangler(['d1', 'execute', db, '--remote', '--yes', '--file', path], {
    stdio: ['ignore', 'inherit', 'inherit'],
  })
}

/**
 * Render a JS value as a SQLite literal for inline INSERTs. Strings are
 * single-quoted with `'` doubled; objects are JSON-stringified then quoted;
 * null/undefined and non-finite numbers become `NULL`.
 * @param {unknown} v - The value from a result row.
 * @returns {string} A SQL literal safe to splice into a VALUES tuple.
 */
function lit(v) {
  if (v === null || v === undefined) return 'NULL'
  const t = typeof v
  if (t === 'number') return Number.isFinite(v) ? String(v) : 'NULL'
  if (t === 'boolean') return v ? '1' : '0'
  const s = t === 'object' ? JSON.stringify(v) : String(v)
  return "'" + s.replace(/'/g, "''") + "'"
}

/**
 * List user tables in a database, excluding SQLite/Cloudflare internal tables.
 * @param {string} db - D1 database name.
 * @returns {string[]} Table names, alphabetically sorted.
 */
function listTables(db) {
  return query(
    db,
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY name;",
  ).map((r) => r.name)
}

/**
 * Count rows in a table.
 * @param {string} db - D1 database name.
 * @param {string} t - Table name.
 * @returns {number} Row count.
 */
function count(db, t) {
  return query(db, `SELECT count(*) AS c FROM "${t}";`)[0]?.c ?? 0
}

/**
 * @typedef {{ from: string, parent: string, to: string }} ForeignKey
 *   A FK edge: child column `from` references `parent.to` (`to` is the PK, `id`).
 */

/**
 * Introspect foreign keys for each table (one `PRAGMA foreign_key_list` per
 * table). Self-edges and edges to excluded (non-content) tables are dropped, so
 * the result only references tables we actually copy.
 * @param {string[]} tables - Content table names.
 * @returns {Map<string, ForeignKey[]>} table → its outgoing FK edges.
 */
function introspectFks(tables) {
  const set = new Set(tables)
  return new Map(
    tables.map((t) => [
      t,
      query(PROD, `PRAGMA foreign_key_list("${t}");`)
        .filter((fk) => fk.table !== t && set.has(fk.table))
        .map((fk) => ({ from: fk.from, parent: fk.table, to: fk.to })),
    ]),
  )
}

/**
 * Order tables so every referenced table precedes the tables that reference it
 * (Kahn topological sort over the FK edges). Required because D1 splits a large
 * `--file` into multiple per-transaction-checked chunks, so a child row must not
 * be inserted before its parent's chunk has committed.
 *
 * If an unexpected cycle ever appears, the remaining tables are appended in
 * their original order as a best effort rather than looping forever.
 * @param {string[]} tables - Content table names to order.
 * @param {Map<string, ForeignKey[]>} fkByTable - From {@link introspectFks}.
 * @returns {string[]} The same tables, referenced-first.
 */
function topoSort(tables, fkByTable) {
  const deps = new Map(tables.map((t) => [t, new Set(fkByTable.get(t).map((fk) => fk.parent))]))
  const ordered = []
  const placed = new Set()
  while (ordered.length < tables.length) {
    const ready = tables.filter(
      (t) => !placed.has(t) && [...deps.get(t)].every((d) => placed.has(d)),
    )
    if (!ready.length) {
      // cycle (shouldn't happen here) — append remainder so we still attempt it
      for (const t of tables) if (!placed.has(t)) (ordered.push(t), placed.add(t))
      break
    }
    for (const t of ready) (ordered.push(t), placed.add(t))
  }
  return ordered
}

/**
 * Append batched `INSERT` statements for one table's rows to `out`.
 * (DELETEs are emitted separately, up front, so all wipes precede all inserts.)
 *
 * Dangling-reference handling: prod contains FK values pointing at rows that no
 * longer exist (e.g. deleted media still referenced by version history). A fresh
 * bulk insert re-checks every constraint, so such values would fail. For each FK
 * column whose value is non-null but absent from the parent's copied ids, we
 * emit `NULL` instead — these are nullable relationship/upload columns, so this
 * is the same "ghosted reference" outcome the app already tolerates. Ids are
 * compared as strings to avoid int/text type-mismatch false positives.
 *
 * Columns are taken from the first row's keys — D1 returns every column as a key
 * — and an explicit column list is emitted, so column order is irrelevant. Rows
 * are chunked by {@link BATCH_ROWS} / {@link BATCH_BYTES} so no single statement
 * gets too long.
 * @param {string} t - Table being copied (for the INSERT target).
 * @param {Array<Record<string, unknown>>} rows - The table's prod rows.
 * @param {ForeignKey[]} fks - This table's FK edges (from {@link introspectFks}).
 * @param {Map<string, Set<string>>} idSets - parent table → set of copied ids
 *   (string-normalized). Fully populated for every table before any inserts are
 *   built, so a child serialized before its parent is still checked correctly.
 * @param {string[]} out - Statement accumulator; mutated in place.
 * @returns {{ rows: number, nulled: number }} Rows emitted and dangling FK
 *   values nulled.
 */
function buildTableInserts(t, rows, fks, idSets, out) {
  if (!rows.length) return { rows: 0, nulled: 0 }
  const cols = Object.keys(rows[0])
  const collist = cols.map((c) => `"${c}"`).join(', ')
  const fkByCol = new Map(fks.map((fk) => [fk.from, fk.parent]))
  let nulled = 0

  /** Literal for one cell, nulling the value if it's a dangling FK reference. */
  const cell = (row, c) => {
    const parent = fkByCol.get(c)
    const v = row[c]
    if (parent && v != null && !idSets.get(parent)?.has(String(v))) {
      nulled++
      return 'NULL'
    }
    return lit(v)
  }

  let batch = []
  let bytes = 0
  const flush = () => {
    if (!batch.length) return
    out.push(`INSERT INTO "${t}" (${collist}) VALUES ${batch.join(', ')};`)
    batch = []
    bytes = 0
  }
  for (const row of rows) {
    const tuple = '(' + cols.map((c) => cell(row, c)).join(', ') + ')'
    if (batch.length && (batch.length >= BATCH_ROWS || bytes + tuple.length > BATCH_BYTES)) flush()
    batch.push(tuple)
    bytes += tuple.length
  }
  flush()
  return { rows: rows.length, nulled }
}

// ---- main ---------------------------------------------------------------

const all = listTables(PROD)
let content = all.filter((t) => !DENY.has(t))
if (NO_VERSIONS) content = content.filter((t) => !t.startsWith('_'))
if (ONLY) content = content.filter((t) => ONLY.has(t))
const excluded = all.filter((t) => !content.includes(t))

console.log(`\nProd → staging (${STAGING}) content pull\n`)
console.log(`Tables to copy: ${content.length}   Excluded: ${excluded.length}`)
console.log(`Excluded (PII / ephemeral / version-skip): ${excluded.join(', ')}\n`)

if (!APPLY) {
  console.log('DRY RUN — no writes. Row counts in prod for tables that would be copied:\n')
  let total = 0
  for (const t of content) {
    const c = count(PROD, t)
    total += c
    if (c > 0) console.log(`  ${String(c).padStart(6)}  ${t}`)
  }
  console.log(`\n  total rows: ${total}`)
  console.log('\nRe-run with --yes to wipe staging content and copy.\n')
  process.exit(0)
}

console.log('APPLYING — resolving table order, reading prod, building load file…\n')

const fkByTable = introspectFks(content)
const ordered = topoSort(content, fkByTable) // referenced tables first

// DELETE children before parents (reverse dependency order) so wipes are valid
// even when D1 splits the file across transactions; then INSERT parents before
// children. defer_foreign_keys is kept as belt-and-suspenders within a chunk.
const out = ['PRAGMA defer_foreign_keys=TRUE;']
for (const t of [...ordered].reverse()) out.push(`DELETE FROM "${t}";`)

// Read every table once and build ALL id-sets BEFORE the nulling pass. Doing
// this up front (rather than accumulating as we go) means a child table that
// happens to be serialized before its parent in topo order can't have valid FK
// values wrongly nulled — the bug that silently nulled every _artists_v.parent_id
// and broke the admin draft view (reconstructs doc id from the version parent).
// Now only genuinely dangling refs (parent value absent from prod entirely) null.
const rowsByTable = new Map()
const idSets = new Map()
for (const t of ordered) {
  const rows = query(PROD, `SELECT * FROM "${t}";`)
  rowsByTable.set(t, rows)
  idSets.set(t, new Set(rows.map((r) => String(r.id))))
}
let total = 0
let nulledTotal = 0
for (const t of ordered) {
  const rows = rowsByTable.get(t)
  const res = buildTableInserts(t, rows, fkByTable.get(t), idSets, out)
  total += res.rows
  nulledTotal += res.nulled
  if (res.rows > 0) {
    console.log(`  read ${String(res.rows).padStart(6)} ← ${t}${res.nulled ? `  (${res.nulled} dangling ref(s) nulled)` : ''}`)
  }
}

const file = join(tmpdir(), 'stage-pull.sql')
const sql = out.join('\n') + '\n'
writeFileSync(file, sql)
console.log(`\nLoad file: ${file}  (${(sql.length / 1e6).toFixed(1)} MB, ${out.length} statements)`)
console.log('Applying to staging…\n')
applyFile(STAGING, file)

console.log(`\n✓ Done. ${total} rows loaded into ${STAGING}${nulledTotal ? `, ${nulledTotal} dangling FK ref(s) nulled` : ''}.`)
console.log('  (PII never copied. Media blobs already shared via R2.)')
console.log('  Note: staging has no users — first /admin visit creates the first admin.\n')
