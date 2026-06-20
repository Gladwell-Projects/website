import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// This migration duplicates 20251103_220413, which already adds the same `col`
// columns to every *_blocks_text table. On a clean from-scratch replay
// 20251103 runs first, so each ADD here is redundant and SQLite raises
// "duplicate column name". We tolerate that (and the matching "no such column"
// on the down) so the chain replays cleanly. Prod applied this migration by name
// and never re-runs it, so this change is invisible there.

const tolerantRun = async (run: () => Promise<unknown>, ignore: string): Promise<void> => {
  try {
    await run()
  } catch (err) {
    if (!String(err).includes(ignore)) throw err
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await tolerantRun(() => db.run(sql`ALTER TABLE \`artists_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_artists_v_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`exhibitions_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`press_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_press_v_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`pages_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_pages_v_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`viewing_rooms_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_text\` ADD \`col\` text DEFAULT '1';`), 'duplicate column')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await tolerantRun(() => db.run(sql`ALTER TABLE \`artists_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_artists_v_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`exhibitions_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_exhibitions_v_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`press_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_press_v_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`pages_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_pages_v_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`viewing_rooms_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
  await tolerantRun(() => db.run(sql`ALTER TABLE \`_viewing_rooms_v_blocks_text\` DROP COLUMN \`col\`;`), 'no such column')
}
