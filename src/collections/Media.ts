import type { CollectionConfig } from 'payload'
import lexicalBasic from './lexical/basicFeatures'
import { admins } from './access/admins'
import { adminsAndEditors } from './access/adminsAndEditors'
import { anyone } from './access/anyone'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    groupBy: true,
    defaultColumns: ['filename', 'caption', 'artworkId', 'preview'],
  },
  enableQueryPresets: true,
  access: {
    read: anyone,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsAndEditors,
    unlock: admins,
  },
  fields: [
    {
      name: 'isArt',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
      label: 'This is an image of an artwork.',
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
          editor: lexicalBasic,
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
          ],
        },
      ],
    },
  ],
  upload: {
    displayPreview: true,
    crop: false,
    focalPoint: false,
    adminThumbnail: ({ doc }) => {
      if (process.env.NEXTJS_ENV === 'development') {
        return `/api/media/file/${doc.filename}`
      }
      return `https://gladwellprojects.com/cdn-cgi/image/height=300,width=300,quality=80,fit=cover${process.env.NEXT_PUBLIC_SERVER_URL === 'https://gladwellprojects.com' ? '/' : `/${process.env.NEXT_PUBLIC_SERVER_URL}/`}api/media/file/${doc.filename}`
    },
  },
}
