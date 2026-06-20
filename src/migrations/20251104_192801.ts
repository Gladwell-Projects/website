// No-op migration.
//
// This originally duplicated 20251103_220413, re-adding the same `col` columns
// to every *_blocks_text table. On a clean from-scratch replay 20251103 adds
// those columns first, so re-adding them here throws "duplicate column name" and
// breaks the migration chain. The columns already exist by this point, so there
// is nothing to do — and nothing to undo. Prod applied the original migration by
// name and never re-runs it, so emptying it is invisible there.

export async function up(): Promise<void> {}

export async function down(): Promise<void> {}
