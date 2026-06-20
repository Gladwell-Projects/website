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

reset="$(mktemp -t website-reset-XXXXXX).sql"
trap 'rm -f "$reset"' EXIT

# Drop existing objects so migrations replay onto a clean DB (re-runnable even
# after a half-applied migration). Dropping tables drops their indexes; D1 has
# foreign-key enforcement off by default, so order is moot.
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
