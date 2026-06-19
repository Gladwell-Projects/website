import type { CollectionBeforeDeleteHook } from 'payload'
import { findMediaReferences } from './findMediaReferences'

/**
 * When a media document is deleted, clear every tracked top-level reference to
 * it so the database doesn't keep dangling upload references. Single uploads are
 * nulled; hasMany relationships (e.g. artists.surveyArtworks) have the deleted
 * id removed from the array. Block-nested + global references are not touched
 * here — the render guards keep those safe.
 */
export const clearMediaReferences: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const references = await findMediaReferences(req.payload, id, req)

  for (const ref of references) {
    const doc = (await req.payload.findByID({
      collection: ref.collection,
      id: ref.id,
      depth: 0,
      overrideAccess: true,
      req,
    })) as unknown as Record<string, unknown>

    const data: Record<string, unknown> = {}
    for (const field of ref.fields) {
      const value = doc[field]
      if (Array.isArray(value)) {
        data[field] = value
          .map((entry) =>
            typeof entry === 'object' && entry ? (entry as { id?: unknown }).id : entry,
          )
          .filter((entryId) => String(entryId) !== String(id))
      } else {
        data[field] = null
      }
    }

    await req.payload.update({
      collection: ref.collection,
      id: ref.id,
      data,
      depth: 0,
      overrideAccess: true,
      req,
    })
  }
}
