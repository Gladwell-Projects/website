import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_exhibitions\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`start_date\` text,
  	\`startdate_tz\` text DEFAULT 'America/New_York',
  	\`end_date\` text,
  	\`enddate_tz\` text DEFAULT 'America/New_York',
  	\`location\` text,
  	\`type\` text DEFAULT 'exhibition',
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`title\` text,
  	\`press_release_id\` text(36),
  	\`checklist_id\` text(36),
  	\`preview_pdf_id\` text(36),
  	\`cover_image_id\` text(36),
  	\`featured_img_id\` text(36),
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`press_release_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`checklist_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`preview_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_img_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_exhibitions\`("id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "type", "generate_slug", "slug", "title", "press_release_id", "checklist_id", "preview_pdf_id", "cover_image_id", "featured_img_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "type", "generate_slug", "slug", "title", "press_release_id", "checklist_id", "preview_pdf_id", "cover_image_id", "featured_img_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`exhibitions\`;`)
  await db.run(sql`DROP TABLE \`exhibitions\`;`)
  await db.run(sql`ALTER TABLE \`__new_exhibitions\` RENAME TO \`exhibitions\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`exhibitions_slug_idx\` ON \`exhibitions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_press_release_idx\` ON \`exhibitions\` (\`press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_checklist_idx\` ON \`exhibitions\` (\`checklist_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_preview_pdf_idx\` ON \`exhibitions\` (\`preview_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_cover_image_idx\` ON \`exhibitions\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_featured_img_idx\` ON \`exhibitions\` (\`featured_img_id\`);`)
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
  	\`version_type\` text DEFAULT 'exhibition',
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_title\` text,
  	\`version_press_release_id\` text(36),
  	\`version_checklist_id\` text(36),
  	\`version_preview_pdf_id\` text(36),
  	\`version_cover_image_id\` text(36),
  	\`version_featured_img_id\` text(36),
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
  	FOREIGN KEY (\`version_press_release_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_checklist_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_preview_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_img_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__exhibitions_v\`("id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_type", "version_generate_slug", "version_slug", "version_title", "version_press_release_id", "version_checklist_id", "version_preview_pdf_id", "version_cover_image_id", "version_featured_img_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_type", "version_generate_slug", "version_slug", "version_title", "version_press_release_id", "version_checklist_id", "version_preview_pdf_id", "version_cover_image_id", "version_featured_img_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_exhibitions_v\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__exhibitions_v\` RENAME TO \`_exhibitions_v\`;`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_parent_idx\` ON \`_exhibitions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_slug_idx\` ON \`_exhibitions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_press_release_idx\` ON \`_exhibitions_v\` (\`version_press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_checklist_idx\` ON \`_exhibitions_v\` (\`version_checklist_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_preview_pdf_idx\` ON \`_exhibitions_v\` (\`version_preview_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_cover_image_idx\` ON \`_exhibitions_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_featured_img_idx\` ON \`_exhibitions_v\` (\`version_featured_img_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_meta_version_meta_image_idx\` ON \`_exhibitions_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_updated_at_idx\` ON \`_exhibitions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_created_at_idx\` ON \`_exhibitions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version__status_idx\` ON \`_exhibitions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_created_at_idx\` ON \`_exhibitions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_updated_at_idx\` ON \`_exhibitions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_latest_idx\` ON \`_exhibitions_v\` (\`latest\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_exhibitions\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`start_date\` text,
  	\`startdate_tz\` text DEFAULT 'America/New_York',
  	\`end_date\` text,
  	\`enddate_tz\` text DEFAULT 'America/New_York',
  	\`location\` text,
  	\`type\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`title\` text,
  	\`press_release_id\` text(36),
  	\`checklist_id\` text(36),
  	\`preview_pdf_id\` text(36),
  	\`cover_image_id\` text(36),
  	\`featured_img_id\` text(36),
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`press_release_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`checklist_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`preview_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_img_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_exhibitions\`("id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "type", "generate_slug", "slug", "title", "press_release_id", "checklist_id", "preview_pdf_id", "cover_image_id", "featured_img_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status") SELECT "id", "start_date", "startdate_tz", "end_date", "enddate_tz", "location", "type", "generate_slug", "slug", "title", "press_release_id", "checklist_id", "preview_pdf_id", "cover_image_id", "featured_img_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at", "_status" FROM \`exhibitions\`;`)
  await db.run(sql`DROP TABLE \`exhibitions\`;`)
  await db.run(sql`ALTER TABLE \`__new_exhibitions\` RENAME TO \`exhibitions\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`exhibitions_slug_idx\` ON \`exhibitions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_press_release_idx\` ON \`exhibitions\` (\`press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_checklist_idx\` ON \`exhibitions\` (\`checklist_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_preview_pdf_idx\` ON \`exhibitions\` (\`preview_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_cover_image_idx\` ON \`exhibitions\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`exhibitions_featured_img_idx\` ON \`exhibitions\` (\`featured_img_id\`);`)
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
  	\`version_type\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_title\` text,
  	\`version_press_release_id\` text(36),
  	\`version_checklist_id\` text(36),
  	\`version_preview_pdf_id\` text(36),
  	\`version_cover_image_id\` text(36),
  	\`version_featured_img_id\` text(36),
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
  	FOREIGN KEY (\`version_press_release_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_checklist_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_preview_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_img_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__exhibitions_v\`("id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_type", "version_generate_slug", "version_slug", "version_title", "version_press_release_id", "version_checklist_id", "version_preview_pdf_id", "version_cover_image_id", "version_featured_img_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_start_date", "version_startdate_tz", "version_end_date", "version_enddate_tz", "version_location", "version_type", "version_generate_slug", "version_slug", "version_title", "version_press_release_id", "version_checklist_id", "version_preview_pdf_id", "version_cover_image_id", "version_featured_img_id", "version_meta_title", "version_meta_description", "version_meta_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_exhibitions_v\`;`)
  await db.run(sql`DROP TABLE \`_exhibitions_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__exhibitions_v\` RENAME TO \`_exhibitions_v\`;`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_parent_idx\` ON \`_exhibitions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_slug_idx\` ON \`_exhibitions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_press_release_idx\` ON \`_exhibitions_v\` (\`version_press_release_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_checklist_idx\` ON \`_exhibitions_v\` (\`version_checklist_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_preview_pdf_idx\` ON \`_exhibitions_v\` (\`version_preview_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_cover_image_idx\` ON \`_exhibitions_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_featured_img_idx\` ON \`_exhibitions_v\` (\`version_featured_img_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_meta_version_meta_image_idx\` ON \`_exhibitions_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_updated_at_idx\` ON \`_exhibitions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version_created_at_idx\` ON \`_exhibitions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_version_version__status_idx\` ON \`_exhibitions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_created_at_idx\` ON \`_exhibitions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_updated_at_idx\` ON \`_exhibitions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_exhibitions_v_latest_idx\` ON \`_exhibitions_v\` (\`latest\`);`)
}
