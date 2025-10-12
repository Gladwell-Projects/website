import type { CollectionConfig } from 'payload'
// import { CvBreak, CvHeading, CvItem } from './blocks/CVBlocks'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { anyone } from './access/anyone'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'profileImage', 'nationality', 'birthYear', 'deathYear'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'artists',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'artists',
        req,
      }),
  },
  access: {
    read: published,
    readVersions: adminsAndEditors,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: adminsAndEditors,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 200, // We set this interval for optimal live preview
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Full Name',
      admin: {
        // hidden: true,
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data) {
              return `${data.firstName}${data.middleName ? ` ${data.middleName} ` : ' '}${data.lastName}${data.suffix ? `, ${data.suffix}` : ''}`
            }
          },
        ],
      },
    },
    ...slugField('title'),
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Bio',
          admin: {
            description: 'Biography and information about the artist.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'middleName',
                  type: 'text',
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'suffix',
                  type: 'text',
                  admin: {
                    width: '10%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nationality',
                  type: 'text',
                },
                {
                  name: 'birthYear',
                  type: 'number',
                },
                {
                  name: 'deathYear',
                  type: 'number',
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
            },
            {
              name: 'socialLinks',
              type: 'group',
              fields: [
                {
                  name: 'website',
                  type: 'text',
                },
                { name: 'instagram', type: 'text' },
                { name: 'twitter', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'CV',
          admin: {
            // description: 'CV information will be compiled into a downloadable PDF',
          },
          fields: [
            {
              type: 'upload',
              relationTo: 'media',
              hasMany: false,
              filterOptions: {
                mimeType: {
                  contains: 'pdf',
                },
              },
              name: 'cvUpload',
              label: 'CV Upload',
            },
            // {
            //   type: 'blocks',
            //   name: 'CV',
            //   label: 'CV Items',
            //   labels: { plural: 'CV Items', singular: 'CV Item' },
            //   blocks: [CvItem, CvBreak, CvHeading],
            // },
          ],
        },
        {
          label: 'Survey',
          admin: {
            description: 'Select artworks to feature on the profile',
          },
          fields: [
            {
              type: 'upload',
              name: 'surveyArtworks',
              label: 'Artworks to include in survey',
              relationTo: 'media',
              hasMany: true,
              filterOptions: () => {
                return {
                  inSurvey: { equals: true },
                  isArt: { equals: true },
                }
              },
            },
          ],
        },
      ],
    },
  ],
}
