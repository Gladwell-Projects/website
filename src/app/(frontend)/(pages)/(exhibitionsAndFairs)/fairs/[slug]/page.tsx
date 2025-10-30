import React from 'react'
import { fetchExhibition, fetchFair } from '../../../../_data'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { Exhibition } from '@/payload-types'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { colors } from '@/fields/theme'
import ExhibitionContent from '../../_components/ExhibitionPage'

export const generateStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'exhibitions',
    draft: false,
    pagination: false,
    limit: 100000,
    depth: 2,
    where: {
      and: [
        {
          _status: {
            equals: true,
          },
        },
        {
          type: {
            equals: 'fair',
          },
        },
      ],
    },
  })
  return pages.docs.map((page) => ({ slug: page.slug }))
}

const ExhibitionPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()

  const { slug } = await params

  const page: Partial<Exhibition> = draft
    ? await fetchFair(slug)
    : await unstable_cache(fetchFair, [`fair-${slug}`])(slug)

  if (!page) {
    notFound()
  }

  return <ExhibitionContent page={page} draft={draft}></ExhibitionContent>
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await fetchExhibition(decodedSlug)

  return generateMeta({ doc: page, colSlug: '/exhibitions' })
}

export const generateViewport = async (): Promise<Viewport> => {
  const themeColor = colors.find((a) => a.theme === 'default').code

  return {
    themeColor,
  }
}

export default ExhibitionPage
