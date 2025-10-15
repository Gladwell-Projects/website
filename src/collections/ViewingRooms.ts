import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'
export const ViewingRooms: CollectionConfig = {
  slug: 'viewingRooms',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
    },
    {
      type: 'richText',
      name: 'content',
    },
    slugField(),
  ],
}
