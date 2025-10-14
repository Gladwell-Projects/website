import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { themePicker } from '@/fields/theme'

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
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsAndEditors,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 200,
      },
    },
  },
  labels: { singular: 'Page', plural: 'Pages' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            ...slugField('title'),
            themePicker(),
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
