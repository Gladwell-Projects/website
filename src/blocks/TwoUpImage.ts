import { Block } from 'payload'

export const TwoImage: Block = {
  slug: 'twoImage',
  admin: {
    group: 'Images',
  },
  labels: { plural: 'Side-by-Side Images', singular: 'Side-by-Side Image' },
  fields: [
    {
      name: 'firstImage',
      type: 'upload',
      label: 'Left Side Image',
      relationTo: 'media',
      hasMany: false,
      displayPreview: true,
    },
    {
      name: 'secondImage',
      type: 'upload',
      label: 'Right Side Image',
      relationTo: 'media',
      hasMany: false,
      displayPreview: true,
    },
    {
      name: 'showCaption',
      label: 'Show Captions',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
