#!/usr/bin/env node
/**
 * @file seed-local.mjs — Persist / restore a prod-like dataset in the LOCAL
 * miniflare D1 so `pnpm dev` and `build:staging` run against real content.
 *
 * Why this exists: the local D1 file already survives restarts, but Payload's
 * dev schema-push REBUILDS mismatched tables on startup, which on D1 silently
 * corrupts an imported snapshot (FK cascades + the SQLite quoted-identifier
 * footgun). So the durable seed lives in `seed/local-seed.sql` (gitignored), and
 * you run dev with push OFF — `pnpm dev:seeded` (or `PAYLOAD_DB_PUSH=off pnpm dev`).
 *
 * The seed is a `sqlite3 .dump` (schema + data, incl. the trash `deleted_at`
 * columns), so restoring it reproduces the exact DB with no post-processing.
 *
 * Usage:
 *   pnpm seed:local         # restore: wipe local D1 and import seed/local-seed.sql
 *   pnpm seed:local:save    # capture: dump the current local D1 to the seed file
 *
 * After a restore, ALWAYS start dev as `pnpm dev:seeded` so push can't clobber it.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const D1_DIR = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
const SEED = 'seed/local-seed.sql'
const SAVE = process.argv.includes('--save')

// miniflare names each local D1 file by a stable hash of the binding's
// database_id. This is the DEFAULT binding (`website`, bdcb1825…) — the file
// that `next build` and `pnpm dev` actually read. The staging-env binding gets
// a different file, so target this one explicitly rather than guessing by size
// (a just-wiped target is tiny and the heuristic picks the wrong file).
const DEFAULT_DB = '39fa60e1a9522b3ed476206216b13ca547fc6f2ef8de1ace1f962e172c95616e.sqlite'

/** Path to the default-binding local D1 file (whether or not it exists yet). */
function localDbFile() {
  const known = join(D1_DIR, DEFAULT_DB)
  if (existsSync(known)) return known
  // Fallback: if the known name ever changes, take the largest populated .sqlite.
  if (!existsSync(D1_DIR)) return known
  const files = readdirSync(D1_DIR)
    .filter((f) => f.endsWith('.sqlite'))
    .map((f) => ({ path: join(D1_DIR, f), size: statSync(join(D1_DIR, f)).size }))
    .sort((a, b) => b.size - a.size)
  return files[0]?.path ?? known
}

function sqlite3(dbPath, sqlOrDot, { input, capture } = {}) {
  const args = [dbPath, sqlOrDot]
  return execFileSync('sqlite3', args, {
    input,
    encoding: capture ? 'buffer' : 'utf8',
    stdio: capture ? ['pipe', 'pipe', 'inherit'] : ['pipe', 'inherit', 'inherit'],
    maxBuffer: 1 << 30,
  })
}

const db = localDbFile()

if (SAVE) {
  if (!db) {
    console.error('seed-local: no local D1 found. Run `pnpm dev` once to create it, then save.')
    process.exit(1)
  }
  mkdirSync('seed', { recursive: true })
  sqlite3(db, 'PRAGMA wal_checkpoint(TRUNCATE);') // fold WAL into the main file first
  const dump = sqlite3(db, '.dump', { capture: true })
  writeFileSync(SEED, dump)
  console.log(`seed-local: saved current local D1 → ${SEED} (${(dump.length / 1e6).toFixed(1)} MB)`)
  process.exit(0)
}

// --- restore (default) ---
if (!existsSync(SEED)) {
  console.error(`seed-local: ${SEED} not found — capture one first with \`pnpm seed:local:save\`.`)
  process.exit(1)
}
if (!db) {
  console.error(
    'seed-local: no local D1 file yet (miniflare names it by a hash on first use).\n' +
      'Run `pnpm dev` once to create it, stop it, then re-run `pnpm seed:local`.',
  )
  process.exit(1)
}
for (const ext of ['', '-shm', '-wal']) rmSync(db + ext, { force: true })
// `sqlite3 <db>` with NO command arg reads SQL from stdin (passing an empty
// command arg would make it run-and-exit without importing).
execFileSync('sqlite3', [db], {
  input: readFileSync(SEED),
  stdio: ['pipe', 'inherit', 'inherit'],
  maxBuffer: 1 << 30,
})
console.log(`seed-local: restored local D1 from ${SEED}.`)
console.log('seed-local: start dev with `pnpm dev:seeded` so schema-push cannot clobber the seed.')
