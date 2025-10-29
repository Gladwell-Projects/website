import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`type\` text;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` ADD \`version_type\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`type\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` DROP COLUMN \`version_type\`;`)
}
