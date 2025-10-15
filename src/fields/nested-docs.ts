import { createParentField } from '@payloadcms/plugin-nested-docs'
import { CollectionSlug } from 'payload'

export const nestedDocs = (collection: CollectionSlug) => {
  return createParentField(collection, {
    filterOptions: ({ id }) => {
      return { id: { not_equals: id } }
    },
  })
}
