import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

export type MediaReference = {
  collection: CollectionSlug
  collectionLabel: string
  id: string | number
  title: string
  fields: string[]
}

/**
 * Top-level upload/relationship fields that point at the `media` collection.
 * These are the references we can resolve reliably with a normal Payload query
 * (block-nested + global references are intentionally out of scope — the render
 * guards keep those safe). Keep in sync with the collection schemas.
 */
const MEDIA_REFERENCE_FIELDS: {
  collection: CollectionSlug
  label: string
  fields: string[]
}[] = [
  { collection: 'press', label: 'Press', fields: ['featuredImage'] },
  { collection: 'events', label: 'Events', fields: ['featuredImage'] },
  { collection: 'exhibitions', label: 'Exhibitions', fields: ['coverImage', 'featuredImg'] },
  { collection: 'artists', label: 'Artists', fields: ['cover', 'profileImage', 'surveyArtworks'] },
  { collection: 'viewingRooms', label: 'Viewing Rooms', fields: ['cover'] },
]

const matchesId = (value: unknown, id: string | number): boolean => {
  if (value == null) return false
  if (Array.isArray(value)) return value.some((entry) => matchesId(entry, id))
  const refId =
    typeof value === 'object' ? (value as { id?: string | number }).id : (value as string | number)
  return refId != null && String(refId) === String(id)
}

/**
 * Find every document that references the given media via one of the tracked
 * top-level fields. Runs at depth 0 so relationships come back as ids, then
 * post-filters to confirm the match (and to report which field(s) matched).
 */
export const findMediaReferences = async (
  payload: Payload,
  mediaId: string | number,
  req?: PayloadRequest,
): Promise<MediaReference[]> => {
  const references: MediaReference[] = []

  for (const { collection, label, fields } of MEDIA_REFERENCE_FIELDS) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      req,
      where: { or: fields.map((field) => ({ [field]: { equals: mediaId } })) },
    })

    for (const doc of result.docs) {
      const record = doc as unknown as Record<string, unknown>
      const matchedFields = fields.filter((field) => matchesId(record[field], mediaId))
      if (matchedFields.length === 0) continue
      references.push({
        collection,
        collectionLabel: label,
        id: doc.id,
        title: (record.title as string) ?? String(doc.id),
        fields: matchedFields,
      })
    }
  }

  return references
}
