import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_half_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_half_image_order_idx\` ON \`pages_blocks_half_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_half_image_parent_id_idx\` ON \`pages_blocks_half_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_half_image_path_idx\` ON \`pages_blocks_half_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_half_image_image_idx\` ON \`pages_blocks_half_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_half_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`show_caption\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_half_image_order_idx\` ON \`_pages_v_blocks_half_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_half_image_parent_id_idx\` ON \`_pages_v_blocks_half_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_half_image_path_idx\` ON \`_pages_v_blocks_half_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_half_image_image_idx\` ON \`_pages_v_blocks_half_image\` (\`image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_half_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_half_image\`;`)
}
