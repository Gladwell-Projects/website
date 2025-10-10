import { CollectionConfig } from 'payload'
import link from '@/fields/link'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
// import { formatSlug } from '@/fields/slug/formatSlug'

export const Press: CollectionConfig = {
  slug: 'press',
  labels: { singular: 'Press Item', plural: 'Press' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'strapline', 'relatedExhibitions'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'press',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'press',
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
  defaultSort: '-date',
  fields: [
    {
      name: 'strapline',
      type: 'text',
      label: 'Strapline',
      required: false,
      admin: {
        description:
          'This is the smaller text before the Headline that usually says something like "From So-and-so Newspaper".',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Headline',
      required: true,
    },
    ...slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArtworks',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedExhibitions',
      type: 'relationship',
      relationTo: 'exhibitions',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'array',
      name: 'links',
      label: 'Links',
      fields: [
        link({
          appearances: false,
          disableLabel: false,
        }),
      ],
    },
  ],
}
