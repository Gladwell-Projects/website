import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    groupBy: true,
    defaultColumns: ['filename', 'caption', 'artworkId', 'artist', 'preview'],
  },
  enableQueryPresets: true,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isArt',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
      label: 'This image is of an artwork.',
    },
    {
      name: 'preview',
      label: 'Preview',
      type: 'text',
      virtual: 'id',
      admin: {
        readOnly: true,
        position: 'sidebar',
        components: {
          Field: '@/components/payload/fields/ImagePreviewField',
          Cell: {
            path: '@/components/payload/ArtworkImageCell',
          },
        },
      },
    },
    {
      type: 'group',
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
        },
        {
          name: 'caption',
          type: 'richText',
        },
      ],
    },
    {
      type: 'group',
      admin: {
        condition: (data) => {
          return data.isArt
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'artworkId',
              type: 'text',
              label: 'Artwork ID',
            },
            {
              name: 'artist',
              type: 'relationship',
              relationTo: 'artists',
            },
          ],
        },
      ],
    },
  ],
  upload: {
    displayPreview: false,
    adminThumbnail: 'small',
  },
}
