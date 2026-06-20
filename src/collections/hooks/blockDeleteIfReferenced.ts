import type { CollectionBeforeDeleteHook, CollectionSlug } from 'payload'
import { APIError } from 'payload'
import { findReferences } from './findReferences'

/**
 * Guard a collection's **permanent** delete: if the document is still referenced
 * by tracked top-level fields elsewhere, throw with an impact list instead of
 * stranding those references (the bare-id / dangling-FK problem this codebase
 * keeps having — see rehydrateRelations + the heal script).
 *
 * Only `beforeDelete` (the permanent-delete path) runs this — soft-deleting to
 * the Trash goes through `update` (sets `deletedAt`) and is intentionally NOT
 * gated, so editors can always trash freely; they're only stopped from *erasing*
 * something other content still points at. Embodies the principle that any
 * destructive action should make the dumbest person stop and think.
 *
 * @param targetCollection - The collection this hook protects (the delete target).
 */
export const blockDeleteIfReferenced =
  (targetCollection: CollectionSlug): CollectionBeforeDeleteHook =>
  async ({ req, id }) => {
    const references = await findReferences(req.payload, targetCollection, id, req)
    if (references.length === 0) return

    const lines = references.map(
      (ref) => `• ${ref.collectionLabel}: “${ref.title}” (${ref.fields.join(', ')})`,
    )
    throw new APIError(
      `Can't permanently delete — still referenced by ${references.length} ` +
        `document${references.length === 1 ? '' : 's'}:\n${lines.join('\n')}\n` +
        `Remove these references first, or leave it in the Trash (where it stays recoverable).`,
      400,
      undefined,
      true, // isPublic: surface the message to the admin user
    )
  }
