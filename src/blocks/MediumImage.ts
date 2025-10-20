import { Block } from 'payload'

export const MdImage: Block = {
  slug: 'mdImage',
  admin: {
    group: 'Images',
  },
  labels: { plural: 'Medium Images', singular: 'Medium Image' },
  fields: [
    {
      name: 'mdImage',
      type: 'upload',
      label: 'Medium Image',
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
