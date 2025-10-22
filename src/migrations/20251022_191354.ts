import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`theme_b_g\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_theme_b_g\` text;`)
  await db.run(sql`ALTER TABLE \`viewing_rooms\` ADD \`theme_b_g\` text;`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v\` ADD \`version_theme_b_g\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_top\` ADD \`theme_b_g\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_bot\` ADD \`theme_b_g\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`theme_b_g\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_theme_b_g\`;`)
  await db.run(sql`ALTER TABLE \`viewing_rooms\` DROP COLUMN \`theme_b_g\`;`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v\` DROP COLUMN \`version_theme_b_g\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_top\` DROP COLUMN \`theme_b_g\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_bot\` DROP COLUMN \`theme_b_g\`;`)
}
