import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`artists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`profile_image_id\` integer,
  	\`first_name\` text,
  	\`middle_name\` text,
  	\`last_name\` text,
  	\`suffix\` text,
  	\`nationality\` text,
  	\`birth_year\` numeric,
  	\`death_year\` numeric,
  	\`bio\` text,
  	\`social_links_website\` text,
  	\`social_links_instagram\` text,
  	\`social_links_twitter\` text,
  	\`cv_upload_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`profile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_slug_idx\` ON \`artists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artists_profile_image_idx\` ON \`artists\` (\`profile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_cv_upload_idx\` ON \`artists\` (\`cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_meta_meta_image_idx\` ON \`artists\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_updated_at_idx\` ON \`artists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artists_created_at_idx\` ON \`artists\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`artists__status_idx\` ON \`artists\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`artists_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artists_rels_order_idx\` ON \`artists_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`artists_rels_parent_idx\` ON \`artists_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_rels_path_idx\` ON \`artists_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`artists_rels_media_id_idx\` ON \`artists_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_profile_image_id\` integer,
  	\`version_first_name\` text,
  	\`version_middle_name\` text,
  	\`version_last_name\` text,
  	\`version_suffix\` text,
  	\`version_nationality\` text,
  	\`version_birth_year\` numeric,
  	\`version_death_year\` numeric,
  	\`version_bio\` text,
  	\`version_social_links_website\` text,
  	\`version_social_links_instagram\` text,
  	\`version_social_links_twitter\` text,
  	\`version_cv_upload_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_profile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_parent_idx\` ON \`_artists_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_slug_idx\` ON \`_artists_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_profile_image_idx\` ON \`_artists_v\` (\`version_profile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_cv_upload_idx\` ON \`_artists_v\` (\`version_cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_meta_version_meta_image_idx\` ON \`_artists_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_updated_at_idx\` ON \`_artists_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_created_at_idx\` ON \`_artists_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version__status_idx\` ON \`_artists_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_created_at_idx\` ON \`_artists_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_updated_at_idx\` ON \`_artists_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_latest_idx\` ON \`_artists_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_artists_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_artists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artists_v_rels_order_idx\` ON \`_artists_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_rels_parent_idx\` ON \`_artists_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_rels_path_idx\` ON \`_artists_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_rels_media_id_idx\` ON \`_artists_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`start_date\` text,
  	\`end_date\` text,
  	\`location\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`title\` text,
  	\`description\` text,
  	\`cover_image_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_slug_idx\` ON \`exhibitions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_cover_image_idx\` ON \`exhibitions\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_meta_meta_image_idx\` ON \`exhibitions\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_updated_at_idx\` ON \`exhibitions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_created_at_idx\` ON \`exhibitions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions__status_idx\` ON \`exhibitions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`exhibitions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exhibitions_rels_order_idx\` ON \`exhibitions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_rels_parent_idx\` ON \`exhibitions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_rels_path_idx\` ON \`exhibitions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_rels_artists_id_idx\` ON \`exhibitions_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_rels_media_id_idx\` ON \`exhibitions_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_exhibitions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_start_date\` text,
  	\`version_end_date\` text,
  	\`version_location\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_cover_image_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
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
  await db.run(sql`CREATE TABLE \`_exhibitions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_exhibitions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_rels_order_idx\` ON \`_exhibitions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_rels_parent_idx\` ON \`_exhibitions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_rels_path_idx\` ON \`_exhibitions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_rels_artists_id_idx\` ON \`_exhibitions_v_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_rels_media_id_idx\` ON \`_exhibitions_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`viewing_rooms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`viewing_rooms_slug_idx\` ON \`viewing_rooms\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_updated_at_idx\` ON \`viewing_rooms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`viewing_rooms_created_at_idx\` ON \`viewing_rooms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`press_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_upload_id\` integer,
  	\`link_label\` text,
  	\`link_custom_id\` text,
  	FOREIGN KEY (\`link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_links_order_idx\` ON \`press_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`press_links_parent_id_idx\` ON \`press_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_links_link_link_upload_idx\` ON \`press_links\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`press\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`strapline\` text,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`date\` text,
  	\`body\` text,
  	\`featured_image_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`press_slug_idx\` ON \`press\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`press_featured_image_idx\` ON \`press\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`press_meta_meta_image_idx\` ON \`press\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`press_updated_at_idx\` ON \`press\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`press_created_at_idx\` ON \`press\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`press__status_idx\` ON \`press\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`press_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`artists_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`press_rels_order_idx\` ON \`press_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_parent_idx\` ON \`press_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_path_idx\` ON \`press_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_media_id_idx\` ON \`press_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_exhibitions_id_idx\` ON \`press_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_pages_id_idx\` ON \`press_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_artists_id_idx\` ON \`press_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_press_id_idx\` ON \`press_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_events_id_idx\` ON \`press_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`press_rels_viewing_rooms_id_idx\` ON \`press_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_version_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_upload_id\` integer,
  	\`link_label\` text,
  	\`link_custom_id\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_version_links_order_idx\` ON \`_press_v_version_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_links_parent_id_idx\` ON \`_press_v_version_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_links_link_link_upload_idx\` ON \`_press_v_version_links\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`_press_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_strapline\` text,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_date\` text,
  	\`version_body\` text,
  	\`version_featured_image_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_parent_idx\` ON \`_press_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_version_slug_idx\` ON \`_press_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_version_featured_image_idx\` ON \`_press_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_meta_version_meta_image_idx\` ON \`_press_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_version_updated_at_idx\` ON \`_press_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_version_created_at_idx\` ON \`_press_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_version_version__status_idx\` ON \`_press_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_created_at_idx\` ON \`_press_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_updated_at_idx\` ON \`_press_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_latest_idx\` ON \`_press_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_press_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`artists_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_press_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_press_v_rels_order_idx\` ON \`_press_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_parent_idx\` ON \`_press_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_path_idx\` ON \`_press_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_media_id_idx\` ON \`_press_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_exhibitions_id_idx\` ON \`_press_v_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_pages_id_idx\` ON \`_press_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_artists_id_idx\` ON \`_press_v_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_press_id_idx\` ON \`_press_v_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_events_id_idx\` ON \`_press_v_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_viewing_rooms_id_idx\` ON \`_press_v_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`start_date\` text,
  	\`end_date\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`featured_image_id\` integer,
  	\`location\` text,
  	\`description\` text,
  	\`is_linked\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_upload_id\` integer,
  	\`link_label\` text,
  	\`link_custom_id\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_featured_image_idx\` ON \`events\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_link_link_upload_idx\` ON \`events\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`events_meta_meta_image_idx\` ON \`events\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`events_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`artists_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_rels_order_idx\` ON \`events_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_parent_idx\` ON \`events_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_path_idx\` ON \`events_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_exhibitions_id_idx\` ON \`events_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_pages_id_idx\` ON \`events_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_artists_id_idx\` ON \`events_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_press_id_idx\` ON \`events_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_events_id_idx\` ON \`events_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`events_rels_viewing_rooms_id_idx\` ON \`events_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`_events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_start_date\` text,
  	\`version_end_date\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_featured_image_id\` integer,
  	\`version_location\` text,
  	\`version_description\` text,
  	\`version_is_linked\` integer,
  	\`version_link_type\` text DEFAULT 'reference',
  	\`version_link_new_tab\` integer,
  	\`version_link_url\` text,
  	\`version_link_upload_id\` integer,
  	\`version_link_label\` text,
  	\`version_link_custom_id\` text,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_parent_idx\` ON \`_events_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_slug_idx\` ON \`_events_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_featured_image_idx\` ON \`_events_v\` (\`version_featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_link_version_link_upload_idx\` ON \`_events_v\` (\`version_link_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_meta_version_meta_image_idx\` ON \`_events_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_updated_at_idx\` ON \`_events_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version_created_at_idx\` ON \`_events_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_version_version__status_idx\` ON \`_events_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_created_at_idx\` ON \`_events_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_updated_at_idx\` ON \`_events_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_latest_idx\` ON \`_events_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_events_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`artists_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_events_v_rels_order_idx\` ON \`_events_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_parent_idx\` ON \`_events_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_path_idx\` ON \`_events_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_exhibitions_id_idx\` ON \`_events_v_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_pages_id_idx\` ON \`_events_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_artists_id_idx\` ON \`_events_v_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_press_id_idx\` ON \`_events_v_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_events_id_idx\` ON \`_events_v_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`_events_v_rels_viewing_rooms_id_idx\` ON \`_events_v_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`doc_id\` integer,
  	\`url\` text,
  	\`label\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_breadcrumbs_order_idx\` ON \`pages_breadcrumbs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_breadcrumbs_parent_id_idx\` ON \`pages_breadcrumbs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_breadcrumbs_doc_idx\` ON \`pages_breadcrumbs\` (\`doc_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`content\` text,
  	\`parent_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_parent_idx\` ON \`pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`doc_id\` integer,
  	\`url\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_breadcrumbs_order_idx\` ON \`_pages_v_version_breadcrumbs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_breadcrumbs_parent_id_idx\` ON \`_pages_v_version_breadcrumbs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_breadcrumbs_doc_idx\` ON \`_pages_v_version_breadcrumbs\` (\`doc_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_content\` text,
  	\`version_parent_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_parent_idx\` ON \`_pages_v\` (\`version_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`clients_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_sessions_order_idx\` ON \`clients_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`clients_sessions_parent_id_idx\` ON \`clients_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT '["user"]' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`clients_email_idx\` ON \`clients\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_query_presets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`is_shared\` integer DEFAULT false,
  	\`access_read_constraint\` text DEFAULT 'onlyMe',
  	\`access_update_constraint\` text DEFAULT 'onlyMe',
  	\`access_delete_constraint\` text DEFAULT 'onlyMe',
  	\`where\` text,
  	\`columns\` text,
  	\`related_collection\` text NOT NULL,
  	\`is_temp\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_query_presets_updated_at_idx\` ON \`payload_query_presets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_query_presets_created_at_idx\` ON \`payload_query_presets\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_query_presets_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_query_presets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_query_presets_rels_order_idx\` ON \`payload_query_presets_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_query_presets_rels_parent_idx\` ON \`payload_query_presets_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_query_presets_rels_path_idx\` ON \`payload_query_presets_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_query_presets_rels_users_id_idx\` ON \`payload_query_presets_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`main_menu_menu_items_top\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_upload_id\` integer,
  	\`link_custom_id\` text,
  	FOREIGN KEY (\`link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_top_order_idx\` ON \`main_menu_menu_items_top\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_top_parent_id_idx\` ON \`main_menu_menu_items_top\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_top_link_link_upload_idx\` ON \`main_menu_menu_items_top\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`main_menu_menu_items_bot\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_upload_id\` integer,
  	\`link_custom_id\` text,
  	FOREIGN KEY (\`link_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_bot_order_idx\` ON \`main_menu_menu_items_bot\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_bot_parent_id_idx\` ON \`main_menu_menu_items_bot\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_menu_items_bot_link_link_upload_idx\` ON \`main_menu_menu_items_bot\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`main_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`main_menu_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`artists_id\` integer,
  	\`exhibitions_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_rels_order_idx\` ON \`main_menu_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_parent_idx\` ON \`main_menu_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_path_idx\` ON \`main_menu_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_pages_id_idx\` ON \`main_menu_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_artists_id_idx\` ON \`main_menu_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_exhibitions_id_idx\` ON \`main_menu_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_press_id_idx\` ON \`main_menu_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_events_id_idx\` ON \`main_menu_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_rels_viewing_rooms_id_idx\` ON \`main_menu_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE TABLE \`branding_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text,
  	\`url\` text,
  	\`icon_id\` integer,
  	\`at\` text,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branding\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`branding_social_links_order_idx\` ON \`branding_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`branding_social_links_parent_id_idx\` ON \`branding_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`branding_social_links_icon_idx\` ON \`branding_social_links\` (\`icon_id\`);`)
  await db.run(sql`CREATE TABLE \`branding\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`author\` text,
  	\`keywords\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`branding_logo_idx\` ON \`branding\` (\`logo_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`is_art\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`caption\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`artwork_id\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`artist_id\` integer REFERENCES artists(id);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_x\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_y\` numeric;`)
  await db.run(sql`CREATE INDEX \`media_artist_idx\` ON \`media\` (\`artist_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`artists_id\` integer REFERENCES artists(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`exhibitions_id\` integer REFERENCES exhibitions(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`viewing_rooms_id\` integer REFERENCES viewing_rooms(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`press_id\` integer REFERENCES press(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`events_id\` integer REFERENCES events(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`pages_id\` integer REFERENCES pages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`clients_id\` integer REFERENCES clients(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_artists_id_idx\` ON \`payload_locked_documents_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_exhibitions_id_idx\` ON \`payload_locked_documents_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_viewing_rooms_id_idx\` ON \`payload_locked_documents_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_press_id_idx\` ON \`payload_locked_documents_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_preferences_rels\` ADD \`clients_id\` integer REFERENCES clients(id);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_clients_id_idx\` ON \`payload_preferences_rels\` (\`clients_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`artists\`;`)
  await db.run(sql`DROP TABLE \`artists_rels\`;`)
  await db.run(sql`DROP TABLE \`_artists_v\`;`)
  await db.run(sql`DROP TABLE \`_artists_v_rels\`;`)
  await db.run(sql`DROP TABLE \`exhibitions\`;`)
  await db.run(sql`DROP TABLE \`exhibitions_rels\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v_rels\`;`)
  await db.run(sql`DROP TABLE \`viewing_rooms\`;`)
  await db.run(sql`DROP TABLE \`press_links\`;`)
  await db.run(sql`DROP TABLE \`press\`;`)
  await db.run(sql`DROP TABLE \`press_rels\`;`)
  await db.run(sql`DROP TABLE \`_press_v_version_links\`;`)
  await db.run(sql`DROP TABLE \`_press_v\`;`)
  await db.run(sql`DROP TABLE \`_press_v_rels\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`events_rels\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`_events_v_rels\`;`)
  await db.run(sql`DROP TABLE \`pages_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`clients_sessions\`;`)
  await db.run(sql`DROP TABLE \`clients\`;`)
  await db.run(sql`DROP TABLE \`payload_query_presets\`;`)
  await db.run(sql`DROP TABLE \`payload_query_presets_rels\`;`)
  await db.run(sql`DROP TABLE \`main_menu_menu_items_top\`;`)
  await db.run(sql`DROP TABLE \`main_menu_menu_items_bot\`;`)
  await db.run(sql`DROP TABLE \`main_menu\`;`)
  await db.run(sql`DROP TABLE \`main_menu_rels\`;`)
  await db.run(sql`DROP TABLE \`branding_social_links\`;`)
  await db.run(sql`DROP TABLE \`branding\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height") SELECT "id", "alt", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_preferences_rels\`("id", "order", "parent_id", "path", "users_id") SELECT "id", "order", "parent_id", "path", "users_id" FROM \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_preferences_rels\` RENAME TO \`payload_preferences_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
