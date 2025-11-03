import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`artists_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_spacer_order_idx\` ON \`artists_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_spacer_parent_id_idx\` ON \`artists_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_spacer_path_idx\` ON \`artists_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_spacer_order_idx\` ON \`_artists_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_spacer_parent_id_idx\` ON \`_artists_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_spacer_path_idx\` ON \`_artists_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_spacer_order_idx\` ON \`exhibitions_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_spacer_parent_id_idx\` ON \`exhibitions_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_spacer_path_idx\` ON \`exhibitions_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_spacer_order_idx\` ON \`_exhibitions_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_spacer_parent_id_idx\` ON \`_exhibitions_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_spacer_path_idx\` ON \`_exhibitions_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_spacer_order_idx\` ON \`press_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_spacer_parent_id_idx\` ON \`press_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_spacer_path_idx\` ON \`press_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_spacer_order_idx\` ON \`_press_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_spacer_parent_id_idx\` ON \`_press_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_spacer_path_idx\` ON \`_press_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_order_idx\` ON \`pages_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_parent_id_idx\` ON \`pages_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_spacer_path_idx\` ON \`pages_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_order_idx\` ON \`_pages_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_parent_id_idx\` ON \`_pages_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_spacer_path_idx\` ON \`_pages_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_spacer_order_idx\` ON \`viewing_rooms_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_spacer_parent_id_idx\` ON \`viewing_rooms_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_spacer_path_idx\` ON \`viewing_rooms_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_spacer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`space_width\` text DEFAULT 'half',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_spacer_order_idx\` ON \`_viewing_rooms_v_blocks_spacer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_spacer_parent_id_idx\` ON \`_viewing_rooms_v_blocks_spacer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_spacer_path_idx\` ON \`_viewing_rooms_v_blocks_spacer\` (\`_path\`);`)
  await db.run(sql`ALTER TABLE \`artists_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_artists_v_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`exhibitions_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`press_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_press_v_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`viewing_rooms_blocks_text\` ADD \`col\` text DEFAULT '1';`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_text\` ADD \`col\` text DEFAULT '1';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`artists_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_spacer\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_spacer\`;`)
  await db.run(sql`ALTER TABLE \`artists_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`exhibitions_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`press_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`_press_v_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`viewing_rooms_blocks_text\` DROP COLUMN \`col\`;`)
  await db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_text\` DROP COLUMN \`col\`;`)
}
