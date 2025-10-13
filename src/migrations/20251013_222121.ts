import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`artists__status_idx\` ON \`artists\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`_artists_v\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(sql`ALTER TABLE \`_artists_v\` ADD \`latest\` integer;`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version__status_idx\` ON \`_artists_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_latest_idx\` ON \`_artists_v\` (\`latest\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`artists__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`artists\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`_artists_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_artists_v_latest_idx\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v\` DROP COLUMN \`latest\`;`)
}
