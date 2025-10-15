import { slugField } from 'payload'
import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { themePicker } from '@/fields/theme'
import { anyone } from './access/anyone'
import { nestedDocs } from '@/fields/nested-docs'
import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'

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
    drafts: true,
  },
  labels: { singular: 'Page', plural: 'Pages' },
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
      type: 'richText',
    },
  ],
}
