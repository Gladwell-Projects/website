import { CollectionConfig, UploadFieldSingleValidation } from 'payload'
import link from '@/fields/link'
import { published } from './access/published'
import { adminsAndEditors } from './access/adminsAndEditors'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { admins } from './access/admins'
// import { formatSlug } from '@/fields/slug/formatSlug'

// Reject saving a press item whose featured image is missing or has no file/URL.
// A dangling upload reference (the media was deleted) or a media with a null
// `url` renders an unusable `<Image>` that throws during static prerender and
// fails the production build, so we catch it at save time in the admin instead.
const validateFeaturedImage: UploadFieldSingleValidation = async (value, { req }) => {
  if (!value || !req?.payload) return true

  const id =
    typeof value === 'object' && value !== null
      ? (value as { id?: string | number }).id
      : (value as string | number)
  if (!id) return true

  try {
    const media = await req.payload.findByID({ collection: 'media', id, depth: 0 })
    if (!media?.url) {
      return 'The selected featured image has no file/URL — re-upload it or choose another image.'
    }
  } catch {
    return 'The selected featured image no longer exists — choose another image.'
  }

  return true
}

export const Press: CollectionConfig = {
  slug: 'press',
  // Soft-delete: deletes are reversible (sets deletedAt) and permanent delete is
  // gated by blockDeleteIfReferenced. Trashed refs ghost-render via rehydrateRelations
  // (see src/app/(frontend)/_data/index.ts).
  trash: true,
  labels: { singular: 'Press Item', plural: 'Press' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'strapline', 'relatedExhibitions'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'press',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'press',
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
  defaultSort: '-date',
  fields: [
    {
      name: 'strapline',
      type: 'text',
      label: 'Strapline',
      required: false,
      admin: {
        description:
          'This is the smaller text before the Headline that usually says something like "From So-and-so Newspaper".',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Headline',
      required: true,
    },
    slugField(),
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' },
      },
    },
    {
      name: 'content',
      label: 'Summary',
      type: 'richText',
      required: true,
    },
    {
      name: 'contentBlocks',
      type: 'blocks',
      label: 'Content',
      blockReferences: [
        'headline',
        'text',
        'lgImage',
        'mdImage',
        'smImage',
        'gallery',
        'twoImage',
        'halfImage',
        'spacer',
      ],
      blocks: [],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      validate: validateFeaturedImage,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArtists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: {
        position: 'sidebar',
        // Trash-aware list UI (resolves/flags trashed refs the native field
        // would render as "untitled"). See the shared component.
        components: {
          Field: '@/components/payload/fields/TrashAwareRelationship',
        },
      },
    },
    {
      name: 'relatedExhibitions',
      type: 'relationship',
      relationTo: 'exhibitions',
      hasMany: true,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/payload/fields/TrashAwareRelationship',
        },
      },
    },
    {
      type: 'array',
      name: 'links',
      label: 'Links',
      fields: [
        link({
          appearances: false,
          disableLabel: false,
        }),
      ],
    },
  ],
}
