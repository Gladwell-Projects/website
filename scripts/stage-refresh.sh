#!/usr/bin/env bash
set -euo pipefail

# Rebuild staging's schema from Payload migrations (deterministic, no wrangler
# schema export to fight). This gets staging to a clean, deployable state.
#
# Cloning prod *content* is intentionally NOT done here: wrangler's export/import
# wraps data in BEGIN/COMMIT (which the importer rejects) and chokes on large
# INSERTs ("Statement too long"), per Cloudflare's D1 import/export docs — so it's
# unreliable as an automated step. Seed staging via the admin, or run a dedicated
# data-clone once that's been made robust.
#
# Prereqs: staging D1 created + its id set in wrangler.jsonc (env.staging).
# Run from the package root: `pnpm run stage:refresh`, then `pnpm run stage`.

WRANGLER="pnpm exec wrangler"
STAGING_DB="website-staging"

# Safety assert: this script DROPS ALL TABLES on $STAGING_DB. It must NEVER run
# against prod. The name is hardcoded above, but assert it anyway so a future
# edit (or an env/arg override) can't turn this into a prod wipe — exactly the
# class of accident that cost us the featured-artist data.
if [ "$STAGING_DB" != "website-staging" ]; then
  echo "stage-refresh: refusing to run — target '$STAGING_DB' is not 'website-staging'." >&2
  exit 1
fi

reset="$(mktemp -t website-reset-XXXXXX).sql"
trap 'rm -f "$reset"' EXIT

# Drop existing objects so migrations replay onto a clean DB (re-runnable even
# after a half-applied migration). NOTE: D1 ENFORCES foreign keys and ignores
# `PRAGMA foreign_keys=OFF`, so dropping a referenced parent table does an
# implicit cascading DELETE into its children — fine here since we drop every
# table, but never assume FKs are "off" on D1.
echo "→ Resetting staging (dropping existing tables)…"
$WRANGLER d1 execute "$STAGING_DB" --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%';" \
  | node -e 'const d=JSON.parse(require("fs").readFileSync(0,"utf8"));const rows=(Array.isArray(d)?d[0]?.results:d.results)||[];process.stdout.write(rows.map((r)=>"DROP TABLE IF EXISTS \""+r.name+"\";").join("\n"))' > "$reset"
if [ -s "$reset" ]; then
  $WRANGLER d1 execute "$STAGING_DB" --remote --yes --file="$reset"
fi

echo "→ Building staging schema from migrations…"
pnpm run stage:database

echo "✓ Staging schema rebuilt. Deploy with 'pnpm run stage'; seed content via the admin."
