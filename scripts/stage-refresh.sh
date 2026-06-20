#!/usr/bin/env bash
set -euo pipefail

# Refresh the staging D1 from prod WITHOUT ever copying PII off prod.
#
# Result: staging == prod schema + prod data (minus the PII tables) + any
# staging-only pending migrations.
#
# `wrangler d1 export` only supports an allow-list (--table), not an exclude
# list, so we: (1) clone the full schema (structure only, no rows), (2) clone
# data for every table EXCEPT the PII ones, then (3) migrate staging forward.
# The PII rows are never exported, so they never leave prod.
#
# Prereqs: `wrangler d1 create website-staging` done and its id set in
# wrangler.jsonc (env.staging). Run from the package root: `pnpm run stage:refresh`.

# Tables whose rows must never be copied to staging.
PII_TABLES=("contact_submissions")

WRANGLER="pnpm exec wrangler"
PROD_DB="website"
STAGING_DB="website-staging"

schema="$(mktemp -t website-schema-XXXXXX).sql"
data="$(mktemp -t website-data-XXXXXX).sql"
reset="$(mktemp -t website-reset-XXXXXX).sql"
trap 'rm -f "$schema" "$data" "$reset"' EXIT

# Drop any existing objects so the import is a clean replace and the script is
# re-runnable (e.g. after a half-applied migration). Dropping tables also drops
# their indexes; D1 has foreign-key enforcement off by default, so order is moot.
echo "→ Resetting staging (dropping existing tables)…"
$WRANGLER d1 execute "$STAGING_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"DROP TABLE IF EXISTS \""+r.name+"\";").join("\n"))' > "$reset"
if [ -s "$reset" ]; then
  $WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$reset"
fi

echo "→ Cloning prod schema into staging (structure only, no rows)…"
$WRANGLER d1 export "$PROD_DB" --remote --no-data --output "$schema"
$WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$schema"

echo "→ Selecting content tables to copy (excluding: ${PII_TABLES[*]})…"
not_in=$(printf "'%s'," "${PII_TABLES[@]}"); not_in="${not_in%,}"
table_flags=$($WRANGLER d1 execute "$PROD_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ($not_in) AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"--table="+r.name).join(" "))')

# Safety: never fall through to an unfiltered export (which would dump PII).
if [ -z "$table_flags" ]; then
  echo "✗ Could not resolve content tables — aborting to avoid exporting PII." >&2
  exit 1
fi

echo "→ Cloning prod data into staging (PII excluded)…"
# shellcheck disable=SC2086 # $table_flags must word-split into many --table args
$WRANGLER d1 export "$PROD_DB" --remote --no-schema $table_flags --output "$data"
$WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$data"

echo "→ Applying staging-only migrations…"
pnpm run stage:database

echo "✓ Staging refreshed — PII (${PII_TABLES[*]}) never left prod."
