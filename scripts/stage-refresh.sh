#!/usr/bin/env bash
set -euo pipefail

# Refresh staging: rebuild its schema from Payload migrations, then clone prod's
# content data (excluding PII).
#
# Why this shape: cloning a Payload/D1 database via wrangler's schema export is
# fragile (export ordering under a transactional import) and the migration
# history can't be replayed naively (an id-type change). So we build the schema
# with Payload's own migrations — deterministic, no export ordering — and only
# use wrangler to copy *data* for the non-PII tables. PII tables are never
# exported, so PII never leaves prod.
#
# Result: staging == freshly-migrated schema + prod content (minus PII).
#
# Prereqs: staging D1 created + its id set in wrangler.jsonc (env.staging).
# Run from the package root: `pnpm run stage:refresh`.

# Rows that must never be copied to staging.
PII_TABLES=("contact_submissions")
# Also skip Payload's migration log — stage:database rebuilds it.
SKIP_DATA=("${PII_TABLES[@]}" "payload_migrations")

WRANGLER="pnpm exec wrangler"
PROD_DB="website"
STAGING_DB="website-staging"

reset="$(mktemp -t website-reset-XXXXXX).sql"
data="$(mktemp -t website-data-XXXXXX).sql"
trap 'rm -f "$reset" "$data"' EXIT

echo "→ Resetting staging (dropping existing tables)…"
$WRANGLER d1 execute "$STAGING_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"DROP TABLE IF EXISTS \""+r.name+"\";").join("\n"))' > "$reset"
if [ -s "$reset" ]; then
  $WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$reset"
fi

echo "→ Building staging schema from migrations…"
pnpm run stage:database

echo "→ Selecting content tables to copy (excluding: ${SKIP_DATA[*]})…"
not_in=$(printf "'%s'," "${SKIP_DATA[@]}"); not_in="${not_in%,}"
table_flags=$($WRANGLER d1 execute "$PROD_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ($not_in) AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"--table="+r.name).join(" "))')

if [ -z "$table_flags" ]; then
  echo "✗ Could not resolve content tables — aborting to avoid exporting PII." >&2
  exit 1
fi

echo "→ Cloning prod content data into staging (PII excluded)…"
# shellcheck disable=SC2086 # $table_flags must word-split into many --table args
$WRANGLER d1 export "$PROD_DB" --remote --no-schema $table_flags --output "$data"
$WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$data"

echo "✓ Staging refreshed — schema from migrations, content cloned, PII never exported."
