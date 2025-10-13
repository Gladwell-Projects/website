import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`footer_links_primary\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_links_primary_order_idx\` ON \`footer_links_primary\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_links_primary_parent_id_idx\` ON \`footer_links_primary\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_links_primary_link_link_upload_idx\` ON \`footer_links_primary\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_links_secondary\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_links_secondary_order_idx\` ON \`footer_links_secondary\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_links_secondary_parent_id_idx\` ON \`footer_links_secondary\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_links_secondary_link_link_upload_idx\` ON \`footer_links_secondary\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tagline\` text,
  	\`site_description\` text,
  	\`show_copyright\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`footer_rels\` (
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
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artists_id\`) REFERENCES \`artists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`exhibitions_id\`) REFERENCES \`exhibitions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`press_id\`) REFERENCES \`press\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`viewing_rooms_id\`) REFERENCES \`viewing_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_rels_order_idx\` ON \`footer_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_parent_idx\` ON \`footer_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_path_idx\` ON \`footer_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_pages_id_idx\` ON \`footer_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_artists_id_idx\` ON \`footer_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_exhibitions_id_idx\` ON \`footer_rels\` (\`exhibitions_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_press_id_idx\` ON \`footer_rels\` (\`press_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_events_id_idx\` ON \`footer_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_viewing_rooms_id_idx\` ON \`footer_rels\` (\`viewing_rooms_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`start_date\` text,
  	\`startdate_tz\` text DEFAULT 'America/New_York',
  	\`end_date\` text,
  	\`enddate_tz\` text DEFAULT 'America/New_York',
  	\`has_time\` integer,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`featured_image_id\` integer,
  	\`location\` text,
  	\`content\` text,
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
  await db.run(sql`INSERT INTO \`__new_events\`("id", "title", "start_date", "startdate_tz", "end_date", "enddate_tz", "has_time", "slug", "slug_lock", "featured_image_id", "location", "content", "is_linked", "link_type", "link_new_tab", "link_url", "link_upload_id", "link_label", "link_custom_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "start_date", "startdate_tz", "end_date", "enddate_tz", "has_time", "slug", "slug_lock", "featured_image_id", "location", "content", "is_linked", "link_type", "link_new_tab", "link_url", "link_upload_id", "link_label", "link_custom_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`events\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`ALTER TABLE \`__new_events\` RENAME TO \`events\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_featured_image_idx\` ON \`events\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_link_link_upload_idx\` ON \`events\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`events_meta_meta_image_idx\` ON \`events\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_start_date\` text,
  	\`version_startdate_tz\` text DEFAULT 'America/New_York',
  	\`version_end_date\` text,
  	\`version_enddate_tz\` text DEFAULT 'America/New_York',
  	\`version_has_time\` integer,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_featured_image_id\` integer,
  	\`version_location\` text,
  	\`version_content\` text,
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
  await db.run(sql`INSERT INTO \`__new__events_v\`("id", "parent_id", "version_title", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_has_time", "version_slug", "version_slug_lock", "version_featured_image_id", "version_location", "version_content", "version_is_linked", "version_link_type", "version_link_new_tab", "version_link_url", "version_link_upload_id", "version_link_label", "version_link_custom_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_has_time", "version_slug", "version_slug_lock", "version_featured_image_id", "version_location", "version_content", "version_is_linked", "version_link_type", "version_link_new_tab", "version_link_url", "version_link_upload_id", "version_link_label", "version_link_custom_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__events_v\` RENAME TO \`_events_v\`;`)
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
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`startdate_tz\` text DEFAULT 'America/New_York';`)
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`enddate_tz\` text DEFAULT 'America/New_York';`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` ADD \`version_startdate_tz\` text DEFAULT 'America/New_York';`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` ADD \`version_enddate_tz\` text DEFAULT 'America/New_York';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`footer_links_primary\`;`)
  await db.run(sql`DROP TABLE \`footer_links_secondary\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`start_date\` text,
  	\`startdate_tz\` text,
  	\`end_date\` text,
  	\`enddate_tz\` text,
  	\`has_time\` integer,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`featured_image_id\` integer,
  	\`location\` text,
  	\`content\` text,
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
  await db.run(sql`INSERT INTO \`__new_events\`("id", "title", "start_date", "startdate_tz", "end_date", "enddate_tz", "has_time", "slug", "slug_lock", "featured_image_id", "location", "content", "is_linked", "link_type", "link_new_tab", "link_url", "link_upload_id", "link_label", "link_custom_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "start_date", "startdate_tz", "end_date", "enddate_tz", "has_time", "slug", "slug_lock", "featured_image_id", "location", "content", "is_linked", "link_type", "link_new_tab", "link_url", "link_upload_id", "link_label", "link_custom_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`events\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`ALTER TABLE \`__new_events\` RENAME TO \`events\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_featured_image_idx\` ON \`events\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_link_link_upload_idx\` ON \`events\` (\`link_upload_id\`);`)
  await db.run(sql`CREATE INDEX \`events_meta_meta_image_idx\` ON \`events\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`events__status_idx\` ON \`events\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_start_date\` text,
  	\`version_startdate_tz\` text,
  	\`version_end_date\` text,
  	\`version_enddate_tz\` text,
  	\`version_has_time\` integer,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_featured_image_id\` integer,
  	\`version_location\` text,
  	\`version_content\` text,
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
  await db.run(sql`INSERT INTO \`__new__events_v\`("id", "parent_id", "version_title", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_has_time", "version_slug", "version_slug_lock", "version_featured_image_id", "version_location", "version_content", "version_is_linked", "version_link_type", "version_link_new_tab", "version_link_url", "version_link_upload_id", "version_link_label", "version_link_custom_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_has_time", "version_slug", "version_slug_lock", "version_featured_image_id", "version_location", "version_content", "version_is_linked", "version_link_type", "version_link_new_tab", "version_link_url", "version_link_upload_id", "version_link_label", "version_link_custom_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_events_v\`;`)
  await db.run(sql`DROP TABLE \`_events_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__events_v\` RENAME TO \`_events_v\`;`)
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
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`startdate_tz\`;`)
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`enddate_tz\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` DROP COLUMN \`version_startdate_tz\`;`)
  await db.run(sql`ALTER TABLE \`_exhibitions_v\` DROP COLUMN \`version_enddate_tz\`;`)
}
