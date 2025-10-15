import link from '@/fields/link'
import { CollectionConfig } from 'payload'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'events',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'events',
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
  defaultSort: 'startDate',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      label: 'Start',
      type: 'date',
      required: true,
      timezone: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      label: 'End',
      type: 'date',
      required: true,
      timezone: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'hasTime',
      label: 'Include Time',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
    slugField(),
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
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
    {
      name: 'content',
      label: 'Description',
      type: 'richText',
    },
    {
      name: 'relatedExhibitions',
      type: 'relationship',
      relationTo: 'exhibitions',
      hasMany: true,
    },
    {
      type: 'checkbox',
      name: 'isLinked',
      label: 'Provide a link',
    },
    {
      type: 'collapsible',
      admin: {
        condition: (_, siblingData) => siblingData.isLinked,
      },
      fields: [
        link({
          appearances: false,
          disableLabel: false,
        }),
      ],
      label: 'RSVP Link',
    },
  ],
}
