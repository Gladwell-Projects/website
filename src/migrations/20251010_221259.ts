import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`events\` ADD \`startdate_tz\` text;`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`enddate_tz\` text;`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`has_time\` integer;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_startdate_tz\` text;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_enddate_tz\` text;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_has_time\` integer;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`_pages_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`startdate_tz\`;`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`enddate_tz\`;`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`has_time\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_startdate_tz\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_enddate_tz\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_has_time\`;`)
}
