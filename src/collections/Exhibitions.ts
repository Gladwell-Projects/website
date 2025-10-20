import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { admins } from './access/admins'

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
    readVersions: adminsAndEditors,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsAndEditors,
    unlock: admins,
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
      timezone: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      timezone: true,
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
    slugField(),
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
              type: 'row',
              fields: [
                {
                  name: 'pressRelease',
                  label: 'Press Release',
                  admin: {
                    description: 'PDF Please',
                    width: '50%',
                  },
                  type: 'upload',
                  relationTo: 'media',
                  hasMany: false,
                  filterOptions: {
                    mimeType: {
                      contains: 'pdf',
                    },
                  },
                },
                {
                  name: 'checklist',
                  type: 'upload',
                  admin: {
                    description: 'PDF Please',
                    width: '50%',
                  },
                  relationTo: 'media',
                  hasMany: false,
                  filterOptions: {
                    mimeType: {
                      contains: 'pdf',
                    },
                  },
                },
              ],
            },
            {
              name: 'featuredArtists',
              type: 'relationship',
              relationTo: 'artists',
              hasMany: true,
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
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              displayPreview: true,
            },
          ],
        },
      ],
    },
  ],
}
