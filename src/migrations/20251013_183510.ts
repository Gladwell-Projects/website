import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_artists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`featimage_id\` integer,
  	\`first_name\` text,
  	\`middle_name\` text,
  	\`last_name\` text,
  	\`suffix\` text,
  	\`nationality\` text,
  	\`birth_year\` numeric,
  	\`death_year\` numeric,
  	\`content\` text,
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
  	FOREIGN KEY (\`featimage_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_artists\`("id", "title", "slug", "slug_lock", "featimage_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "content", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "slug_lock", "featimage_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "content", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`artists\`;`)
  await db.run(sql`DROP TABLE \`artists\`;`)
  await db.run(sql`ALTER TABLE \`__new_artists\` RENAME TO \`artists\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`artists_slug_idx\` ON \`artists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artists_featimage_idx\` ON \`artists\` (\`featimage_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_cv_upload_idx\` ON \`artists\` (\`cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_meta_meta_image_idx\` ON \`artists\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_updated_at_idx\` ON \`artists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artists_created_at_idx\` ON \`artists\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`artists__status_idx\` ON \`artists\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__artists_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_featimage_id\` integer,
  	\`version_first_name\` text,
  	\`version_middle_name\` text,
  	\`version_last_name\` text,
  	\`version_suffix\` text,
  	\`version_nationality\` text,
  	\`version_birth_year\` numeric,
  	\`version_death_year\` numeric,
  	\`version_content\` text,
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
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featimage_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__artists_v\`("id", "parent_id", "version_title", "version_slug", "version_slug_lock", "version_featimage_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_content", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_slug", "version_slug_lock", "version_featimage_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_content", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_artists_v\`;`)
  await db.run(sql`DROP TABLE \`_artists_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__artists_v\` RENAME TO \`_artists_v\`;`)
  await db.run(sql`CREATE INDEX \`_artists_v_parent_idx\` ON \`_artists_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_slug_idx\` ON \`_artists_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_featimage_idx\` ON \`_artists_v\` (\`version_featimage_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_cv_upload_idx\` ON \`_artists_v\` (\`version_cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_meta_version_meta_image_idx\` ON \`_artists_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_updated_at_idx\` ON \`_artists_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_created_at_idx\` ON \`_artists_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version__status_idx\` ON \`_artists_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_created_at_idx\` ON \`_artists_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_updated_at_idx\` ON \`_artists_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_latest_idx\` ON \`_artists_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_artists_v_autosave_idx\` ON \`_artists_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`__new_press_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` integer,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
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
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`artists_id\` integer,
  	\`exhibitions_id\` integer,
  	\`pages_id\` integer,
  	\`press_id\` integer,
  	\`events_id\` integer,
  	\`viewing_rooms_id\` integer,
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

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_artists\` (
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
  	\`content\` text,
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
  await db.run(sql`INSERT INTO \`__new_artists\`("id", "title", "slug", "slug_lock", "profile_image_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "content", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "slug_lock", "profile_image_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "content", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`artists\`;`)
  await db.run(sql`DROP TABLE \`artists\`;`)
  await db.run(sql`ALTER TABLE \`__new_artists\` RENAME TO \`artists\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`artists_slug_idx\` ON \`artists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artists_profile_image_idx\` ON \`artists\` (\`profile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_cv_upload_idx\` ON \`artists\` (\`cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_meta_meta_image_idx\` ON \`artists\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_updated_at_idx\` ON \`artists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artists_created_at_idx\` ON \`artists\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`artists__status_idx\` ON \`artists\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__artists_v\` (
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
  	\`version_content\` text,
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
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_profile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__artists_v\`("id", "parent_id", "version_title", "version_slug", "version_slug_lock", "version_profile_image_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_content", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_title", "version_slug", "version_slug_lock", "version_profile_image_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_content", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_artists_v\`;`)
  await db.run(sql`DROP TABLE \`_artists_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__artists_v\` RENAME TO \`_artists_v\`;`)
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
  await db.run(sql`CREATE INDEX \`_artists_v_autosave_idx\` ON \`_artists_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`press_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`press_rels_media_id_idx\` ON \`press_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`_press_v_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_press_v_rels_media_id_idx\` ON \`_press_v_rels\` (\`media_id\`);`)
}
