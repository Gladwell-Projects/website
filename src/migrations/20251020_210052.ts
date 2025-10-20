import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`_artists_v_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`exhibitions_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`viewing_rooms_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_half_image\` ADD \`size\` text DEFAULT 'full';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`exhibitions_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`viewing_rooms_blocks_half_image\` DROP COLUMN \`size\`;`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_half_image\` DROP COLUMN \`size\`;`)
}
