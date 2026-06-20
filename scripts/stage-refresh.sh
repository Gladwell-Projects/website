#!/usr/bin/env bash
set -euo pipefail

# Refresh the staging D1 as a clean clone of prod, with PII scrubbed.
#
# Cloning a Payload/D1 database by splitting schema vs. data, or by replaying
# migrations from an empty DB, is fragile here: wrangler's --no-data/--no-schema
# split doesn't preserve table-creation order under its transactional import, and
# this project's migration history changed the id type (integer → uuid) so it
# can't be replayed from scratch. So we do what wrangler is built for — a single
# full export → import (one file, correct order, atomic) — then scrub the PII
# tables from staging and shred the local dump.
#
# PII lives on staging only between the import and the scrub (seconds) and never
# persists; the prod dump is always removed. NOTE: this is not strict zero-transit
# — the dump does momentarily contain PII. If that's unacceptable, we need the
# build-schema-from-migrations approach instead.
#
# Result: staging == prod snapshot, minus PII, plus any staging-only migrations.
#
# Prereqs: `wrangler d1 create website-staging` done and its id set in
# wrangler.jsonc (env.staging). Run from the package root: `pnpm run stage:refresh`.

# Tables whose rows must not live on staging.
PII_TABLES=("contact_submissions")

WRANGLER="pnpm exec wrangler"
PROD_DB="website"
STAGING_DB="website-staging"

dump="$(mktemp -t website-clone-XXXXXX).sql"
reset="$(mktemp -t website-reset-XXXXXX).sql"
trap 'rm -f "$dump" "$reset"' EXIT # never leave the prod dump (with PII) on disk

# Drop existing objects so the import is a clean replace and the script is
# re-runnable (e.g. after a half-applied migration). Dropping tables drops their
# indexes; D1 has foreign-key enforcement off by default, so order is moot.
echo "→ Resetting staging (dropping existing tables)…"
$WRANGLER d1 execute "$STAGING_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"DROP TABLE IF EXISTS \""+r.name+"\";").join("\n"))' > "$reset"
if [ -s "$reset" ]; then
  $WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$reset"
fi

echo "→ Cloning prod → staging (full export, correct order)…"
$WRANGLER d1 export "$PROD_DB" --remote --output "$dump"
$WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$dump"

echo "→ Scrubbing PII from staging…"
for t in "${PII_TABLES[@]}"; do
  $WRANGLER d1 execute "$STAGING_DB" --remote --yes --command "DELETE FROM \"$t\";"
done

echo "→ Shredding local dump…"
rm -f "$dump"

echo "→ Applying staging-only migrations…"
pnpm run stage:database

echo "✓ Staging refreshed (PII scrubbed from staging; dump shredded)."
