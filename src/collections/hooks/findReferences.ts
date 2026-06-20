import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

export type Reference = {
  collection: CollectionSlug
  collectionLabel: string
  id: string | number
  title: string
  fields: string[]
}

type ReferenceSource = {
  collection: CollectionSlug
  label: string
  fields: string[]
}

/**
 * Reverse reference graph, keyed by the TARGET collection (the document being
 * deleted). Each entry lists the top-level upload/relationship fields on OTHER
 * collections that point at that target. Used to (a) power the admin "Used in"
 * panel and (b) block a permanent delete that would strand these references
 * (see {@link ./blockDeleteIfReferenced}).
 *
 * Scope: top-level + hasMany relationship/upload fields resolvable with a depth-0
 * query (hasMany lives in the `_rels` join table, so it matches by field name
 * regardless of group/tab nesting). Block-nested and global references are
 * intentionally out of scope — the render guards + `rehydrateRelations` keep
 * those safe. Keep in sync with the collection schemas.
 */
const REFERENCE_GRAPH: Partial<Record<CollectionSlug, ReferenceSource[]>> = {
  media: [
    { collection: 'press', label: 'Press', fields: ['featuredImage'] },
    { collection: 'events', label: 'Events', fields: ['featuredImage'] },
    { collection: 'exhibitions', label: 'Exhibitions', fields: ['coverImage', 'featuredImg'] },
    { collection: 'artists', label: 'Artists', fields: ['cover', 'profileImage', 'surveyArtworks'] },
    { collection: 'viewingRooms', label: 'Viewing Rooms', fields: ['cover'] },
  ],
  artists: [
    { collection: 'exhibitions', label: 'Exhibitions', fields: ['featuredArtists'] },
    { collection: 'press', label: 'Press', fields: ['relatedArtists'] },
  ],
  exhibitions: [
    { collection: 'press', label: 'Press', fields: ['relatedExhibitions'] },
    { collection: 'events', label: 'Events', fields: ['relatedExhibitions'] },
  ],
}

const matchesId = (value: unknown, id: string | number): boolean => {
  if (value == null) return false
  if (Array.isArray(value)) return value.some((entry) => matchesId(entry, id))
  const refId =
    typeof value === 'object' ? (value as { id?: string | number }).id : (value as string | number)
  return refId != null && String(refId) === String(id)
}

/**
 * Find every document that references the given target document via one of the
 * tracked top-level fields. Runs at depth 0 so relationships come back as ids,
 * then post-filters to confirm the match (and to report which field(s) matched).
 * Trashed referrers are included (`trash: true`) so the delete guard never
 * strands a reference that a restore would bring back.
 *
 * @param payload - The Payload instance.
 * @param targetCollection - The collection of the document being referenced/deleted.
 * @param id - The id of the referenced document.
 * @param req - The originating request (threads transactions/locale through).
 * @returns The list of referencing documents (empty if the target is untracked).
 */
export const findReferences = async (
  payload: Payload,
  targetCollection: CollectionSlug,
  id: string | number,
  req?: PayloadRequest,
): Promise<Reference[]> => {
  const sources = REFERENCE_GRAPH[targetCollection]
  if (!sources) return []

  const references: Reference[] = []

  for (const { collection, label, fields } of sources) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      trash: true,
      req,
      where: { or: fields.map((field) => ({ [field]: { equals: id } })) },
    })

    for (const doc of result.docs) {
      const record = doc as unknown as Record<string, unknown>
      const matchedFields = fields.filter((field) => matchesId(record[field], id))
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
