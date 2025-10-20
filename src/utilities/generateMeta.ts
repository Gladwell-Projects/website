import type { Metadata } from 'next'

import type { Media, Page, Artist, Exhibition, Press, Event } from '@/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: {
  doc:
    | Partial<Page>
    | Partial<Artist>
    | Partial<Press>
    | Partial<Exhibition>
    | Partial<Event>
    | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = doc?.meta?.image as Media

  const title = doc?.meta?.title ? doc?.meta?.title : `${doc?.title} | Gladwell Projects`

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage.url,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
