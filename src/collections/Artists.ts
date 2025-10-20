import type { CollectionConfig } from 'payload'
// import { CvBreak, CvHeading, CvItem } from './blocks/CVBlocks'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from 'payload'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { admins } from './access/admins'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'isRepresented', 'nationality', 'birthYear', 'deathYear'],
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
    unlock: admins,
  },
  versions: {
    drafts: true,
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
        beforeValidate: [
          ({ data }) => {
            let title
            if (data) {
              title = `${data.firstName ? data.firstName : ''}${data.middleName ? ` ${data.middleName} ` : ' '}${data.lastName ? data.lastName : ''}${data.suffix ? `, ${data.suffix}` : ''}`
            } else {
              title = 'unknown'
            }
            return title
          },
        ],
      },
    },
    slugField(),
    {
      name: 'isRepresented',
      type: 'checkbox',
      label: 'Show on Artists page',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'profileImage',
      label: 'Featured Image',
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
              type: 'blocks',
              blockReferences: [
                'headline',
                'text',
                'lgImage',
                'mdImage',
                'smImage',
                'gallery',
                'twoImage',
                'halfImage',
              ],
              blocks: [],
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
              displayPreview: true,
              hasMany: true,
              filterOptions: () => {
                return {
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
