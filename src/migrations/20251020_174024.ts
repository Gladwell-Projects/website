import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`artists_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_headline_order_idx\` ON \`artists_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_headline_parent_id_idx\` ON \`artists_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_headline_path_idx\` ON \`artists_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_text_order_idx\` ON \`artists_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_text_parent_id_idx\` ON \`artists_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_text_path_idx\` ON \`artists_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_lg_image_order_idx\` ON \`artists_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_lg_image_parent_id_idx\` ON \`artists_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_lg_image_path_idx\` ON \`artists_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_lg_image_lg_image_idx\` ON \`artists_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_md_image_order_idx\` ON \`artists_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_md_image_parent_id_idx\` ON \`artists_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_md_image_path_idx\` ON \`artists_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_md_image_md_image_idx\` ON \`artists_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_sm_image_order_idx\` ON \`artists_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_sm_image_parent_id_idx\` ON \`artists_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_sm_image_path_idx\` ON \`artists_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_sm_image_sm_image_idx\` ON \`artists_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_gallery_order_idx\` ON \`artists_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_gallery_parent_id_idx\` ON \`artists_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_gallery_path_idx\` ON \`artists_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`artists_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_blocks_two_image_order_idx\` ON \`artists_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_two_image_parent_id_idx\` ON \`artists_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_two_image_path_idx\` ON \`artists_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_two_image_first_image_idx\` ON \`artists_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_blocks_two_image_second_image_idx\` ON \`artists_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_headline_order_idx\` ON \`_artists_v_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_headline_parent_id_idx\` ON \`_artists_v_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_headline_path_idx\` ON \`_artists_v_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_text_order_idx\` ON \`_artists_v_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_text_parent_id_idx\` ON \`_artists_v_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_text_path_idx\` ON \`_artists_v_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_lg_image_order_idx\` ON \`_artists_v_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_lg_image_parent_id_idx\` ON \`_artists_v_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_lg_image_path_idx\` ON \`_artists_v_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_lg_image_lg_image_idx\` ON \`_artists_v_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_md_image_order_idx\` ON \`_artists_v_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_md_image_parent_id_idx\` ON \`_artists_v_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_md_image_path_idx\` ON \`_artists_v_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_md_image_md_image_idx\` ON \`_artists_v_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_sm_image_order_idx\` ON \`_artists_v_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_sm_image_parent_id_idx\` ON \`_artists_v_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_sm_image_path_idx\` ON \`_artists_v_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_sm_image_sm_image_idx\` ON \`_artists_v_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_gallery_order_idx\` ON \`_artists_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_gallery_parent_id_idx\` ON \`_artists_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_gallery_path_idx\` ON \`_artists_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_two_image_order_idx\` ON \`_artists_v_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_two_image_parent_id_idx\` ON \`_artists_v_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_two_image_path_idx\` ON \`_artists_v_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_two_image_first_image_idx\` ON \`_artists_v_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_blocks_two_image_second_image_idx\` ON \`_artists_v_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_headline_order_idx\` ON \`exhibitions_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_headline_parent_id_idx\` ON \`exhibitions_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_headline_path_idx\` ON \`exhibitions_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_text_order_idx\` ON \`exhibitions_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_text_parent_id_idx\` ON \`exhibitions_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_text_path_idx\` ON \`exhibitions_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_lg_image_order_idx\` ON \`exhibitions_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_lg_image_parent_id_idx\` ON \`exhibitions_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_lg_image_path_idx\` ON \`exhibitions_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_lg_image_lg_image_idx\` ON \`exhibitions_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_md_image_order_idx\` ON \`exhibitions_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_md_image_parent_id_idx\` ON \`exhibitions_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_md_image_path_idx\` ON \`exhibitions_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_md_image_md_image_idx\` ON \`exhibitions_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_sm_image_order_idx\` ON \`exhibitions_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_sm_image_parent_id_idx\` ON \`exhibitions_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_sm_image_path_idx\` ON \`exhibitions_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_sm_image_sm_image_idx\` ON \`exhibitions_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_gallery_order_idx\` ON \`exhibitions_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_gallery_parent_id_idx\` ON \`exhibitions_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_gallery_path_idx\` ON \`exhibitions_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_two_image_order_idx\` ON \`exhibitions_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_two_image_parent_id_idx\` ON \`exhibitions_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_two_image_path_idx\` ON \`exhibitions_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_two_image_first_image_idx\` ON \`exhibitions_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_blocks_two_image_second_image_idx\` ON \`exhibitions_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_headline_order_idx\` ON \`_exhibitions_v_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_headline_parent_id_idx\` ON \`_exhibitions_v_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_headline_path_idx\` ON \`_exhibitions_v_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_text_order_idx\` ON \`_exhibitions_v_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_text_parent_id_idx\` ON \`_exhibitions_v_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_text_path_idx\` ON \`_exhibitions_v_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_lg_image_order_idx\` ON \`_exhibitions_v_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_lg_image_parent_id_idx\` ON \`_exhibitions_v_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_lg_image_path_idx\` ON \`_exhibitions_v_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_lg_image_lg_image_idx\` ON \`_exhibitions_v_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_md_image_order_idx\` ON \`_exhibitions_v_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_md_image_parent_id_idx\` ON \`_exhibitions_v_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_md_image_path_idx\` ON \`_exhibitions_v_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_md_image_md_image_idx\` ON \`_exhibitions_v_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_sm_image_order_idx\` ON \`_exhibitions_v_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_sm_image_parent_id_idx\` ON \`_exhibitions_v_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_sm_image_path_idx\` ON \`_exhibitions_v_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_sm_image_sm_image_idx\` ON \`_exhibitions_v_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_gallery_order_idx\` ON \`_exhibitions_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_gallery_parent_id_idx\` ON \`_exhibitions_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_gallery_path_idx\` ON \`_exhibitions_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_two_image_order_idx\` ON \`_exhibitions_v_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_two_image_parent_id_idx\` ON \`_exhibitions_v_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_two_image_path_idx\` ON \`_exhibitions_v_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_two_image_first_image_idx\` ON \`_exhibitions_v_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_blocks_two_image_second_image_idx\` ON \`_exhibitions_v_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_sm_image_order_idx\` ON \`pages_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sm_image_parent_id_idx\` ON \`pages_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sm_image_path_idx\` ON \`pages_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_sm_image_sm_image_idx\` ON \`pages_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_image_order_idx\` ON \`pages_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_image_parent_id_idx\` ON \`pages_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_image_path_idx\` ON \`pages_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_image_first_image_idx\` ON \`pages_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_two_image_second_image_idx\` ON \`pages_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sm_image_order_idx\` ON \`_pages_v_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sm_image_parent_id_idx\` ON \`_pages_v_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sm_image_path_idx\` ON \`_pages_v_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_sm_image_sm_image_idx\` ON \`_pages_v_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_image_order_idx\` ON \`_pages_v_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_image_parent_id_idx\` ON \`_pages_v_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_image_path_idx\` ON \`_pages_v_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_image_first_image_idx\` ON \`_pages_v_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_two_image_second_image_idx\` ON \`_pages_v_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_headline_order_idx\` ON \`viewing_rooms_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_headline_parent_id_idx\` ON \`viewing_rooms_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_headline_path_idx\` ON \`viewing_rooms_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_text_order_idx\` ON \`viewing_rooms_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_text_parent_id_idx\` ON \`viewing_rooms_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_text_path_idx\` ON \`viewing_rooms_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_lg_image_order_idx\` ON \`viewing_rooms_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_lg_image_parent_id_idx\` ON \`viewing_rooms_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_lg_image_path_idx\` ON \`viewing_rooms_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_lg_image_lg_image_idx\` ON \`viewing_rooms_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_md_image_order_idx\` ON \`viewing_rooms_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_md_image_parent_id_idx\` ON \`viewing_rooms_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_md_image_path_idx\` ON \`viewing_rooms_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_md_image_md_image_idx\` ON \`viewing_rooms_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_sm_image_order_idx\` ON \`viewing_rooms_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_sm_image_parent_id_idx\` ON \`viewing_rooms_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_sm_image_path_idx\` ON \`viewing_rooms_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_sm_image_sm_image_idx\` ON \`viewing_rooms_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_gallery_order_idx\` ON \`viewing_rooms_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_gallery_parent_id_idx\` ON \`viewing_rooms_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_gallery_path_idx\` ON \`viewing_rooms_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_two_image_order_idx\` ON \`viewing_rooms_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_two_image_parent_id_idx\` ON \`viewing_rooms_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_two_image_path_idx\` ON \`viewing_rooms_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_two_image_first_image_idx\` ON \`viewing_rooms_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_blocks_two_image_second_image_idx\` ON \`viewing_rooms_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_rels_order_idx\` ON \`viewing_rooms_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_rels_parent_idx\` ON \`viewing_rooms_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_rels_path_idx\` ON \`viewing_rooms_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_rels_media_id_idx\` ON \`viewing_rooms_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_headline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`width\` text DEFAULT 'half',
  	\`headline\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_headline_order_idx\` ON \`_viewing_rooms_v_blocks_headline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_headline_parent_id_idx\` ON \`_viewing_rooms_v_blocks_headline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_headline_path_idx\` ON \`_viewing_rooms_v_blocks_headline\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_text_order_idx\` ON \`_viewing_rooms_v_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_text_parent_id_idx\` ON \`_viewing_rooms_v_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_text_path_idx\` ON \`_viewing_rooms_v_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_lg_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`lg_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`lg_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_lg_image_order_idx\` ON \`_viewing_rooms_v_blocks_lg_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_lg_image_parent_id_idx\` ON \`_viewing_rooms_v_blocks_lg_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_lg_image_path_idx\` ON \`_viewing_rooms_v_blocks_lg_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_lg_image_lg_image_idx\` ON \`_viewing_rooms_v_blocks_lg_image\` (\`lg_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_md_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`md_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`md_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_md_image_order_idx\` ON \`_viewing_rooms_v_blocks_md_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_md_image_parent_id_idx\` ON \`_viewing_rooms_v_blocks_md_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_md_image_path_idx\` ON \`_viewing_rooms_v_blocks_md_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_md_image_md_image_idx\` ON \`_viewing_rooms_v_blocks_md_image\` (\`md_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_sm_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`sm_image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`sm_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_sm_image_order_idx\` ON \`_viewing_rooms_v_blocks_sm_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_sm_image_parent_id_idx\` ON \`_viewing_rooms_v_blocks_sm_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_sm_image_path_idx\` ON \`_viewing_rooms_v_blocks_sm_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_sm_image_sm_image_idx\` ON \`_viewing_rooms_v_blocks_sm_image\` (\`sm_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`gallery_header\` text,
  	\`default_state\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_gallery_order_idx\` ON \`_viewing_rooms_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_gallery_parent_id_idx\` ON \`_viewing_rooms_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_gallery_path_idx\` ON \`_viewing_rooms_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_blocks_two_image\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_two_image_order_idx\` ON \`_viewing_rooms_v_blocks_two_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_two_image_parent_id_idx\` ON \`_viewing_rooms_v_blocks_two_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_two_image_path_idx\` ON \`_viewing_rooms_v_blocks_two_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_two_image_first_image_idx\` ON \`_viewing_rooms_v_blocks_two_image\` (\`first_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_blocks_two_image_second_image_idx\` ON \`_viewing_rooms_v_blocks_two_image\` (\`second_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_theme\` text DEFAULT 'default',
  	\`version_cover_id\` text(36),
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_parent_idx\` ON \`_viewing_rooms_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_version_version_cover_idx\` ON \`_viewing_rooms_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_version_version_slug_idx\` ON \`_viewing_rooms_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_version_version_updated_at_idx\` ON \`_viewing_rooms_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_version_version_created_at_idx\` ON \`_viewing_rooms_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_version_version__status_idx\` ON \`_viewing_rooms_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_created_at_idx\` ON \`_viewing_rooms_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_updated_at_idx\` ON \`_viewing_rooms_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_latest_idx\` ON \`_viewing_rooms_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_viewing_rooms_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_viewing_rooms_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_rels_order_idx\` ON \`_viewing_rooms_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_rels_parent_idx\` ON \`_viewing_rooms_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_rels_path_idx\` ON \`_viewing_rooms_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_viewing_rooms_v_rels_media_id_idx\` ON \`_viewing_rooms_v_rels\` (\`media_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_viewing_rooms\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`theme\` text DEFAULT 'default',
  	\`cover_id\` text(36),
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_viewing_rooms\`("id", "title", "theme", "cover_id", "generate_slug", "slug", "updated_at", "created_at", "_status") SELECT "id", "title", "theme", "cover_id", "generate_slug", "slug", "updated_at", "created_at", "_status" FROM \`viewing_rooms\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms\`;`)
  await db.run(sql`ALTER TABLE \`__new_viewing_rooms\` RENAME TO \`viewing_rooms\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_cover_idx\` ON \`viewing_rooms\` (\`cover_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`viewing_rooms_slug_idx\` ON \`viewing_rooms\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_updated_at_idx\` ON \`viewing_rooms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_created_at_idx\` ON \`viewing_rooms\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms__status_idx\` ON \`viewing_rooms\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`meta_image_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`media_meta_meta_image_idx\` ON \`media\` (\`meta_image_id\`);`)
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`press_release_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`checklist_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`exhibitions_press_release_idx\` ON \`exhibitions\` (\`press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_checklist_idx\` ON \`exhibitions\` (\`checklist_id\`);`)
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` ADD \`version_press_release_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` ADD \`version_checklist_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_press_release_idx\` ON \`_exhibitions_v\` (\`version_press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_checklist_idx\` ON \`_exhibitions_v\` (\`version_checklist_id\`);`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` DROP COLUMN \`version_content\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_headline\` ADD \`width\` text DEFAULT 'half';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_lg_image\` ADD \`show_caption\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_md_image\` ADD \`show_caption\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`gallery_header\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`default_state\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_headline\` ADD \`width\` text DEFAULT 'half';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_lg_image\` ADD \`show_caption\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_md_image\` ADD \`show_caption\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`gallery_header\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`default_state\` text;`)
  await db.run(sql`ALTER TABLE \`artists\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`_artists_v\` DROP COLUMN \`version_content\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`artists_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`artists_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms_rels\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_headline\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_lg_image\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_md_image\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_sm_image\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_blocks_two_image\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v\`;`)
  await db.run(sql`DROP TABLE \`_viewing_rooms_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`is_art\` integer DEFAULT true,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`artwork_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "is_art", "alt", "caption", "artwork_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y") SELECT "id", "is_art", "alt", "caption", "artwork_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`__new_exhibitions\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`start_date\` text,
  	\`startdate_tz\` text DEFAULT 'America/New_York',
  	\`end_date\` text,
  	\`enddate_tz\` text DEFAULT 'America/New_York',
  	\`location\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`title\` text,
  	\`content\` text,
  	\`cover_image_id\` text(36),
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_exhibitions\`("id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "generate_slug", "slug", "title", "content", "cover_image_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "generate_slug", "slug", "title", "content", "cover_image_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`exhibitions\`;`)
  await db.run(sql`DROP TABLE \`exhibitions\`;`)
  await db.run(sql`ALTER TABLE \`__new_exhibitions\` RENAME TO \`exhibitions\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`exhibitions_slug_idx\` ON \`exhibitions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_cover_image_idx\` ON \`exhibitions\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_meta_meta_image_idx\` ON \`exhibitions\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_updated_at_idx\` ON \`exhibitions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_created_at_idx\` ON \`exhibitions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions__status_idx\` ON \`exhibitions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__exhibitions_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_start_date\` text,
  	\`version_startdate_tz\` text DEFAULT 'America/New_York',
  	\`version_end_date\` text,
  	\`version_enddate_tz\` text DEFAULT 'America/New_York',
  	\`version_location\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_title\` text,
  	\`version_content\` text,
  	\`version_cover_image_id\` text(36),
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` text(36),
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__exhibitions_v\`("id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_generate_slug", "version_slug", "version_title", "version_content", "version_cover_image_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_generate_slug", "version_slug", "version_title", "version_content", "version_cover_image_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_exhibitions_v\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__exhibitions_v\` RENAME TO \`_exhibitions_v\`;`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_parent_idx\` ON \`_exhibitions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_slug_idx\` ON \`_exhibitions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_cover_image_idx\` ON \`_exhibitions_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_meta_version_meta_image_idx\` ON \`_exhibitions_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_updated_at_idx\` ON \`_exhibitions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_created_at_idx\` ON \`_exhibitions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version__status_idx\` ON \`_exhibitions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_created_at_idx\` ON \`_exhibitions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_updated_at_idx\` ON \`_exhibitions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_latest_idx\` ON \`_exhibitions_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_viewing_rooms\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_viewing_rooms\`("id", "title", "content", "generate_slug", "slug", "updated_at", "created_at") SELECT "id", "title", "content", "generate_slug", "slug", "updated_at", "created_at" FROM \`viewing_rooms\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms\`;`)
  await db.run(sql`ALTER TABLE \`__new_viewing_rooms\` RENAME TO \`viewing_rooms\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`viewing_rooms_slug_idx\` ON \`viewing_rooms\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_updated_at_idx\` ON \`viewing_rooms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_created_at_idx\` ON \`viewing_rooms\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`artists\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`_artists_v\` ADD \`version_content\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_headline\` DROP COLUMN \`width\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_lg_image\` DROP COLUMN \`show_caption\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_md_image\` DROP COLUMN \`show_caption\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` DROP COLUMN \`gallery_header\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` DROP COLUMN \`default_state\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_headline\` DROP COLUMN \`width\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_lg_image\` DROP COLUMN \`show_caption\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_md_image\` DROP COLUMN \`show_caption\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` DROP COLUMN \`gallery_header\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` DROP COLUMN \`default_state\`;`)
}
