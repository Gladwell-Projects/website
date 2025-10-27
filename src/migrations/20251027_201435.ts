import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`artists\` ADD \`cover_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`artists_cover_idx\` ON \`artists\` (\`cover_id\`);`)
  await db.run(sql`ALTER TABLE \`_artists_v\` ADD \`version_cover_id\` text(36) REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_artists_v_version_version_cover_idx\` ON \`_artists_v\` (\`version_cover_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_artists\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`is_represented\` integer DEFAULT true,
  	\`profile_image_id\` text(36),
  	\`first_name\` text,
  	\`middle_name\` text,
  	\`last_name\` text,
  	\`suffix\` text,
  	\`nationality\` text,
  	\`birth_year\` numeric,
  	\`death_year\` numeric,
  	\`social_links_website\` text,
  	\`social_links_instagram\` text,
  	\`social_links_twitter\` text,
  	\`cv_upload_id\` text(36),
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`profile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cv_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_artists\`("id", "title", "generate_slug", "slug", "is_represented", "profile_image_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "generate_slug", "slug", "is_represented", "profile_image_id", "first_name", "middle_name", "last_name", "suffix", "nationality", "birth_year", "death_year", "social_links_website", "social_links_instagram", "social_links_twitter", "cv_upload_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`artists\`;`)
  await db.run(sql`DROP TABLE \`artists\`;`)
  await db.run(sql`ALTER TABLE \`__new_artists\` RENAME TO \`artists\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`artists_slug_idx\` ON \`artists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artists_profile_image_idx\` ON \`artists\` (\`profile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_cv_upload_idx\` ON \`artists\` (\`cv_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_meta_meta_image_idx\` ON \`artists\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_updated_at_idx\` ON \`artists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artists_created_at_idx\` ON \`artists\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`artists__status_idx\` ON \`artists\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__artists_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_is_represented\` integer DEFAULT true,
  	\`version_profile_image_id\` text(36),
  	\`version_first_name\` text,
  	\`version_middle_name\` text,
  	\`version_last_name\` text,
  	\`version_suffix\` text,
  	\`version_nationality\` text,
  	\`version_birth_year\` numeric,
  	\`version_death_year\` numeric,
  	\`version_social_links_website\` text,
  	\`version_social_links_instagram\` text,
  	\`version_social_links_twitter\` text,
  	\`version_cv_upload_id\` text(36),
  	\`version_meta_title\` text,
  	\`version_meta_description\` text,
  	\`version_meta_image_id\` text(36),
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
  await db.run(sql`INSERT INTO \`__new__artists_v\`("id", "parent_id", "version_title", "version_generate_slug", "version_slug", "version_is_represented", "version_profile_image_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_generate_slug", "version_slug", "version_is_represented", "version_profile_image_id", "version_first_name", "version_middle_name", "version_last_name", "version_suffix", "version_nationality", "version_birth_year", "version_death_year", "version_social_links_website", "version_social_links_instagram", "version_social_links_twitter", "version_cv_upload_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_artists_v\`;`)
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
}
