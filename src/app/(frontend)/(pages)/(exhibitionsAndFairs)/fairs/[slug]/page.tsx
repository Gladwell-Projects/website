import React from 'react'
import { fetchExhibition, fetchFair, getPayloadClient } from '../../../../_data'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Exhibition } from '@/payload-types'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { themeCode } from '@/fields/theme'
import ExhibitionContent from '../../_components/ExhibitionPage'

export const generateStaticParams = async () => {
  const payload = await getPayloadClient()
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
            equals: 'published',
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

  const page: Partial<Exhibition> = await fetchFair(slug)

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
  const themeColor = themeCode('default')

  return {
    themeColor,
  }
}

export default ExhibitionPage
