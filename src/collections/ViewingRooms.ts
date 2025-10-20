import { themePicker } from '@/fields/theme'
import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { admins } from './access/admins'

export const ViewingRooms: CollectionConfig = {
  slug: 'viewingRooms',
  versions: {
    drafts: true,
  },
  access: {
    read: published,
    readVersions: adminsAndEditors,
    update: adminsAndEditors,
    delete: admins,
    unlock: admins,
    create: adminsAndEditors,
  },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      required: true,
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
        'halfImage',
      ],
      blocks: [],
    },
    slugField(),
  ],
}
