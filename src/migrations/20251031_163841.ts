import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`press_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_headline_order_idx\` ON \`press_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_headline_parent_id_idx\` ON \`press_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_headline_path_idx\` ON \`press_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_text_order_idx\` ON \`press_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_text_parent_id_idx\` ON \`press_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_text_path_idx\` ON \`press_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_lg_image_order_idx\` ON \`press_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_lg_image_parent_id_idx\` ON \`press_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_lg_image_path_idx\` ON \`press_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_lg_image_lg_image_idx\` ON \`press_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_md_image_order_idx\` ON \`press_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_md_image_parent_id_idx\` ON \`press_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_md_image_path_idx\` ON \`press_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_md_image_md_image_idx\` ON \`press_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_sm_image_order_idx\` ON \`press_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_sm_image_parent_id_idx\` ON \`press_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_sm_image_path_idx\` ON \`press_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_sm_image_sm_image_idx\` ON \`press_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_gallery_order_idx\` ON \`press_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_gallery_parent_id_idx\` ON \`press_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_gallery_path_idx\` ON \`press_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_two_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`first_image_id\` text(36),
  	\`second_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`first_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`second_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_two_image_order_idx\` ON \`press_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_two_image_parent_id_idx\` ON \`press_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_two_image_path_idx\` ON \`press_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_two_image_first_image_idx\` ON \`press_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_two_image_second_image_idx\` ON \`press_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`press_blocks_half_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`size\` text DEFAULT 'full',
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_blocks_half_image_order_idx\` ON \`press_blocks_half_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_half_image_parent_id_idx\` ON \`press_blocks_half_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_half_image_path_idx\` ON \`press_blocks_half_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`press_blocks_half_image_image_idx\` ON \`press_blocks_half_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_headline_order_idx\` ON \`_press_v_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_headline_parent_id_idx\` ON \`_press_v_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_headline_path_idx\` ON \`_press_v_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_text_order_idx\` ON \`_press_v_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_text_parent_id_idx\` ON \`_press_v_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_text_path_idx\` ON \`_press_v_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_lg_image_order_idx\` ON \`_press_v_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_lg_image_parent_id_idx\` ON \`_press_v_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_lg_image_path_idx\` ON \`_press_v_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_lg_image_lg_image_idx\` ON \`_press_v_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_md_image_order_idx\` ON \`_press_v_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_md_image_parent_id_idx\` ON \`_press_v_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_md_image_path_idx\` ON \`_press_v_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_md_image_md_image_idx\` ON \`_press_v_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_sm_image_order_idx\` ON \`_press_v_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_sm_image_parent_id_idx\` ON \`_press_v_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_sm_image_path_idx\` ON \`_press_v_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_sm_image_sm_image_idx\` ON \`_press_v_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_gallery_order_idx\` ON \`_press_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_gallery_parent_id_idx\` ON \`_press_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_gallery_path_idx\` ON \`_press_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_two_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`first_image_id\` text(36),
  	\`second_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`first_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`second_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_two_image_order_idx\` ON \`_press_v_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_two_image_parent_id_idx\` ON \`_press_v_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_two_image_path_idx\` ON \`_press_v_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_two_image_first_image_idx\` ON \`_press_v_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_two_image_second_image_idx\` ON \`_press_v_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_blocks_half_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`size\` text DEFAULT 'full',
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_half_image_order_idx\` ON \`_press_v_blocks_half_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_half_image_parent_id_idx\` ON \`_press_v_blocks_half_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_half_image_path_idx\` ON \`_press_v_blocks_half_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_blocks_half_image_image_idx\` ON \`_press_v_blocks_half_image\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`press_rels\` ADD \`media_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`press_rels_media_id_idx\` ON \`press_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`_press_v_rels\` ADD \`media_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_media_id_idx\` ON \`_press_v_rels\` (\`media_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`press_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`press_blocks_half_image\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`_press_v_blocks_half_image\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_press_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` text(36),
  	\`exhibitions_id\` text(36),
  	\`pages_id\` text(36),
  	\`press_id\` text(36),
  	\`events_id\` text(36),
  	\`viewing_rooms_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_press_rels\`("id", "order", "parent_id", "path", "artists_id", "exhibitions_id", "pages_id", "press_id", "events_id", "viewing_rooms_id") SELECT "id", "order", "parent_id", "path", "artists_id", "exhibitions_id", "pages_id", "press_id", "events_id", "viewing_rooms_id" FROM \`press_rels\`;`)
  await db.run(sql`DROP TABLE \`press_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_press_rels\` RENAME TO \`press_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`press_rels_order_idx\` ON \`press_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_parent_idx\` ON \`press_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_path_idx\` ON \`press_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_artists_id_idx\` ON \`press_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_exhibitions_id_idx\` ON \`press_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_pages_id_idx\` ON \`press_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_press_id_idx\` ON \`press_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_events_id_idx\` ON \`press_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_viewing_rooms_id_idx\` ON \`press_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__press_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` text(36),
  	\`exhibitions_id\` text(36),
  	\`pages_id\` text(36),
  	\`press_id\` text(36),
  	\`events_id\` text(36),
  	\`viewing_rooms_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__press_v_rels\`("id", "order", "parent_id", "path", "artists_id", "exhibitions_id", "pages_id", "press_id", "events_id", "viewing_rooms_id") SELECT "id", "order", "parent_id", "path", "artists_id", "exhibitions_id", "pages_id", "press_id", "events_id", "viewing_rooms_id" FROM \`_press_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_press_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__press_v_rels\` RENAME TO \`_press_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_order_idx\` ON \`_press_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_parent_idx\` ON \`_press_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_path_idx\` ON \`_press_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_artists_id_idx\` ON \`_press_v_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_exhibitions_id_idx\` ON \`_press_v_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_pages_id_idx\` ON \`_press_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_press_id_idx\` ON \`_press_v_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_events_id_idx\` ON \`_press_v_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_viewing_rooms_id_idx\` ON \`_press_v_rels\` (\`viewing_rooms_id\`);`)
}
