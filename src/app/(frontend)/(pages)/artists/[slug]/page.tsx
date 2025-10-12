import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { notFound } from 'next/navigation'
import ThemeSwitch from '@/app/(frontend)/_ui/ThemeSwitch'
import { Artist } from '@/payload-types'
import { draftMode } from 'next/headers'
import Headline from '@/app/(frontend)/_ui/Headline'
import Content from '@/app/(frontend)/_ui/PageContent'
import SubGrid from '@/app/(frontend)/_ui/pageGrid'
import { fetchDocument } from '@/app/(frontend)/_data'
import { unstable_cache } from 'next/cache'

const getArtist = async (slug: string, draft?: boolean) =>
  draft
    ? fetchDocument('artists', slug)
    : unstable_cache(fetchDocument, [`artist-${slug}`])('artists', slug)

const ArtistBioPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  // const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const page = (await getArtist(slug, draft)) as Artist

  if (!page) {
    notFound()
  }

  if (!page) {
    notFound()
  }

  return (
    <SubGrid>
      <ThemeSwitch templateTheme="default" />
      {draft && <LivePreviewListener />}
      <Headline title={page.title}>
        <h4 className="text-glow-600 col-span-6 row-start-2">
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
        <RichText data={page.content} />
      </Content>
    </SubGrid>
  )
}

export default ArtistBioPage
