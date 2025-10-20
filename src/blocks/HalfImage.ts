import { Block } from 'payload'

export const HalfImage: Block = {
  slug: 'halfImage',
  admin: {
    group: 'Images',
  },
  labels: { plural: 'Half Images', singular: 'Half Image' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      label: 'Half Image',
      relationTo: 'media',
      hasMany: false,
      displayPreview: true,
      admin: {
        description:
          'Half images take up half the space and will be on the right side if it follows a text block.',
      },
    },
    {
      name: 'size',
      type: 'select',
      options: ['full', 'small', 'x-small'],
      defaultValue: 'full',
    },
    {
      name: 'showCaption',
      label: 'Show Caption',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
