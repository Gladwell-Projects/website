import { Block } from 'payload'

export const LgImage: Block = {
  slug: 'lgImage',
  admin: {
    group: 'Images',
  },
  labels: { singular: 'Full Width Image', plural: 'Full Width Images' },
  fields: [
    {
      name: 'lgImage',
      label: 'Full Width Image',
      type: 'upload',
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
