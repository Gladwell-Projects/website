import type { Metadata } from 'next'

import type { Media, Page, Artist, Exhibition, Press, Event } from '@/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { fetchGlobals } from '@/app/(frontend)/_data'
import { getServerSideURL } from './getURL'

export const generateMeta = async (args: {
  doc:
    | Partial<Page>
    | Partial<Artist>
    | Partial<Press>
    | Partial<Exhibition>
    | Partial<Event>
    | null
  colSlug?: string
}): Promise<Metadata> => {
  const { doc, colSlug } = args

  const defaults = (await fetchGlobals()).branding

  const ogImage = doc?.meta?.image as Media

  const defaultImage = defaults.logo as Media

  const baseUrl = getServerSideURL()

  const url = `${baseUrl}${colSlug ? colSlug : ''}${Array.isArray(doc?.slug) ? `/${doc?.slug.join('/')}` : `${doc?.slug.startsWith('/') ? doc.slug : `/${doc.slug}`}`}`

  const title = doc?.meta?.title ? doc?.meta?.title : `${doc?.title} | ${defaults.title}`

  return {
    metadataBase: new URL(baseUrl),
    description: doc?.meta?.description || defaults.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || defaults.description,
      images: ogImage
        ? [
            {
              url: ogImage.url,
            },
          ]
        : defaultImage
          ? [
              {
                url: defaultImage.url,
              },
            ]
          : undefined,
      title,
      url,
    }),
    title,
  }
}
