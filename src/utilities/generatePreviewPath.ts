import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  artists: '/artists',
  pages: '',
  exhibitions: '/exhibitions',
  press: '/press',
  events: '/events',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // if (Array.isArray(slug)) {
  //   const segment = slug

  //   const document = segment.split('/').at(-1)

  //   const encodedParams = new URLSearchParams({
  //     slug: document,
  //     collection,
  //     path: `${segment}`,
  //     previewSecret: process.env.PREVIEW_SECRET || '',
  //   })

  //   const url = `/next/preview?${encodedParams.toString()}`

  //   return url
  // }

  // console.log(slug, collection)

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
