import { slugField } from 'payload'
import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { themePicker } from '@/fields/theme'
import { admins } from './access/admins'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
  },
  access: {
    read: published,
    readVersions: adminsAndEditors,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsAndEditors,
    unlock: admins,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    themePicker(),
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
        'spacer',
      ],
      blocks: [],
    },
  ],
}
