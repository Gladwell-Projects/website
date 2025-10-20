import { themePicker } from '@/fields/theme'
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'
export const ViewingRooms: CollectionConfig = {
  slug: 'viewingRooms',
  versions: {
    drafts: true,
  },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
    },
    themePicker(),
    {
      type: 'upload',
      name: 'cover',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      filterOptions: {
        mimeType: {
          contains: 'image',
        },
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blockReferences: [
        'headline',
        'text',
        'lgImage',
        'mdImage',
        'smImage',
        'gallery',
        'twoImage',
      ],
      blocks: [],
    },
    slugField(),
  ],
}
