import { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  admin: {
    group: 'Images',
  },
  fields: [
    {
      name: 'galleryHeader',
      label: 'Gallery Title',
      type: 'text',
    },
    {
      name: 'defaultState',
      label: 'Default View',
      type: 'select',
      options: ['Grid', 'Slides'],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      displayPreview: true,
      /*
       * TODO: ADD FILTERING FOR EXISTING IMAGES IN THE UPLOAD FIELD
       */
      filterOptions: () => {
        return {
          and: [
            {
              mimeType: {
                contains: 'image',
              },
            },
          ],
        }
      },
    },
  ],
}
