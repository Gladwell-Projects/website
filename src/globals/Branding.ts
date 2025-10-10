import { adminsAndEditors } from '@/collections/access/adminsAndEditors'
import { anyone } from '@/collections/access/anyone'
import { GlobalConfig } from 'payload'

export const BrandSettings: GlobalConfig = {
  slug: 'branding',
  admin: {
    group: 'Site Utilities',
  },
  access: {
    read: anyone,
    update: adminsAndEditors,
  },
  fields: [
    {
      type: 'upload',
      relationTo: 'media',
      name: 'logo',
      displayPreview: true,
    },
    {
      type: 'text',
      name: 'title',
      label: 'Site Title',
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Site Description',
    },
    {
      type: 'text',
      name: 'author',
    },
    {
      type: 'textarea',
      name: 'keywords',
      label: 'Keywords',
      admin: {
        description: 'A list of keywords separated by commas.',
      },
    },
    {
      type: 'array',
      name: 'socialLinks',
      admin: {
        components: {
          RowLabel: 'src/globals/CustomRowLabelTabs',
        },
      },
      fields: [
        {
          type: 'select',
          options: ['Instagram', 'Facebook', 'X / Twitter', 'Threads', 'Other'],
          name: 'type',
        },
        {
          type: 'text',
          name: 'url',
          label: 'URL',
          admin: {
            condition: (_, siblingData) => siblingData.type === 'Other',
          },
        },
        {
          type: 'upload',
          relationTo: 'media',
          name: 'icon',
          label: 'Social Icon',
          admin: {
            description:
              'upload a black icon in PNG or SVG format with transparent background up to 64 x 64 pixels',
            condition: (_, siblingData) => siblingData.type === 'Other',
          },
        },
        {
          type: 'text',
          name: 'at',
          admin: {
            condition: (_, siblingData) => siblingData.type && siblingData.type !== 'Other',
          },
          label: 'Username (without @)',
        },
      ],
    },
  ],
}

export default BrandSettings
