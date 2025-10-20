import { Block } from 'payload'

export const SmImage: Block = {
  slug: 'smImage',
  admin: {
    group: 'Images',
  },
  labels: { plural: 'Small Images', singular: 'Small Image' },
  fields: [
    {
      name: 'smImage',
      type: 'upload',
      label: 'Small Image',
      relationTo: 'media',
      hasMany: false,
      displayPreview: true,
    },
    {
      name: 'showCaption',
      label: 'Show Caption',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
