import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Exhibitions: CollectionConfig = {
  slug: 'exhibitions',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'exhibitions',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'exhibitions',
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
  labels: { singular: 'Exhibition', plural: 'Exhibitions' },
  fields: [
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'featuredArtists',
              type: 'relationship',
              relationTo: 'artists',
              hasMany: true,
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              type: 'group',
              fields: [
                {
                  name: 'coverImage',
                  type: 'upload',
                  relationTo: 'media',
                  displayPreview: true,
                },
                {
                  name: 'featuredArtworks',
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: true,
                  displayPreview: true,
                  filterOptions: {
                    isArt: { equals: true },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
