import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists\` RENAME COLUMN "bio" TO "content";`)
  await db.run(sql`ALTER TABLE \`_artists_v\` RENAME COLUMN "version_bio" TO "version_content";`)
  await db.run(sql`ALTER TABLE \`exhibitions\` RENAME COLUMN "description" TO "content";`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` RENAME COLUMN "version_description" TO "version_content";`)
  await db.run(sql`ALTER TABLE \`press\` RENAME COLUMN "body" TO "content";`)
  await db.run(sql`ALTER TABLE \`_press_v\` RENAME COLUMN "version_body" TO "version_content";`)
  await db.run(sql`ALTER TABLE \`events\` RENAME COLUMN "description" TO "content";`)
  await db.run(sql`ALTER TABLE \`_events_v\` RENAME COLUMN "version_description" TO "version_content";`)
  await db.run(sql`ALTER TABLE \`_artists_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_artists_v_autosave_idx\` ON \`_artists_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`viewing_rooms\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`theme\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_theme\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_top\` ADD \`theme\` text;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_bot\` ADD \`theme\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists\` RENAME COLUMN "content" TO "bio";`)
  await db.run(sql`ALTER TABLE \`_artists_v\` RENAME COLUMN "version_content" TO "version_bio";`)
  await db.run(sql`ALTER TABLE \`exhibitions\` RENAME COLUMN "content" TO "description";`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` RENAME COLUMN "version_content" TO "version_description";`)
  await db.run(sql`ALTER TABLE \`press\` RENAME COLUMN "content" TO "body";`)
  await db.run(sql`ALTER TABLE \`_press_v\` RENAME COLUMN "version_content" TO "version_body";`)
  await db.run(sql`ALTER TABLE \`events\` RENAME COLUMN "content" TO "description";`)
  await db.run(sql`ALTER TABLE \`_events_v\` RENAME COLUMN "version_content" TO "version_description";`)
  await db.run(sql`DROP INDEX \`_artists_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`ALTER TABLE \`viewing_rooms\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`theme\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_theme\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_top\` DROP COLUMN \`theme\`;`)
  await db.run(sql`ALTER TABLE \`main_menu_menu_items_bot\` DROP COLUMN \`theme\`;`)
}
