import React, { cache } from 'react'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { notFound } from 'next/navigation'
import ThemeSwitch from '@/app/(frontend)/_ui/ThemeSwitch'
import { Media } from '@/payload-types'
import { draftMode } from 'next/headers'
import Headline from '@/app/(frontend)/_ui/Headline'
import Content from '@/app/(frontend)/_ui/PageContent'
import SubGrid from '@/app/(frontend)/_ui/pageGrid'
import { fetchArtist } from '@/app/(frontend)/_data'
import { unstable_cache } from 'next/cache'
import PageBlocks from '@/app/(frontend)/_ui/PageBlocks'
import Gallery from '@/app/(frontend)/_ui/Gallery'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const generateStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'artists',
    draft: false,
    pagination: false,
    limit: 100000,
    depth: 2,
  })
  return pages.docs.map((page) => ({ slug: page.slug }))
}

const getArtist = async (slug: string, draft?: boolean) =>
  draft ? fetchArtist(slug) : unstable_cache(fetchArtist, [`artist-${slug}`])(slug)

const ArtistBioPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const page = await getArtist(slug, draft)

  if (!page) {
    notFound()
  }

  const survey =
    Array.isArray(page.surveyArtworks) && typeof page.surveyArtworks[0] === 'object'
      ? page.surveyArtworks
      : []

  const cv = typeof page.cvUpload === 'object' ? page.cvUpload : null

  return (
    <SubGrid>
      <ThemeSwitch templateTheme="default" />
      {draft && <LivePreviewListener />}
      <Headline title={page.title}>
        <h4 className="text-glow-600 col-span-6">
          {!page.deathYear && page.birthYear && 'b. '}
          {page.birthYear && `${page.birthYear}`}
          {page.deathYear && !page.birthYear && 'd. '}
          {page.deathYear && page.birthYear && '—'}
          {page.deathYear && `${page.deathYear}`}
          {(page.birthYear || page.deathYear) && page.nationality && ','}{' '}
          {page.nationality && page.nationality}
        </h4>
      </Headline>
      <Content>
        {cv ? (
          <Link className="col-span-4 no-underline" href={cv.url}>
            Download CV&emsp;<small>(PDF)</small>
          </Link>
        ) : null}
        <PageBlocks data={page.content} />
        {survey.length > 0 && (
          <Gallery galleryItems={survey} defaultState="Grid" header="Survey" />
        )}
      </Content>
    </SubGrid>
  )
}

export default ArtistBioPage

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
  const page = await queryPageBySlug({ slug: decodedSlug })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
