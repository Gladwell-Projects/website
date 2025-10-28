import React, { cache } from 'react'
import { fetchExhibition } from '../../../_data'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ThemeSwitch from '@/app/(frontend)/_ui/ThemeSwitch'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import SubGrid from '@/app/(frontend)/_ui/pageGrid'
import Headline from '@/app/(frontend)/_ui/Headline'
import Content from '@/app/(frontend)/_ui/PageContent'
import { unstable_cache } from 'next/cache'
import { Artist, Exhibition, Media } from '@/payload-types'
import Image from 'next/image'
import { dateISO, dateToLong } from '@/utilities/convertCMSDate'
import PageBlocks from '@/app/(frontend)/_ui/PageBlocks'
import Link from 'next/link'
import { Caption } from '@/app/(frontend)/_ui/Image'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { colors } from '@/fields/theme'

export const generateStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'exhibitions',
    draft: false,
    pagination: false,
    limit: 100000,
    depth: 2,
  })
  return pages.docs.map((page) => ({ slug: page.slug }))
}

const ExhibitionPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()

  const { slug } = await params

  const page: Partial<Exhibition> = draft
    ? await fetchExhibition(slug)
    : await unstable_cache(fetchExhibition)(slug)

  if (!page) {
    notFound()
  }

  const cover = page.coverImage ? (page.coverImage as Media) : null
  const start = dateToLong(page.startDate, page.startDate_tz)
  const end = dateToLong(page.endDate, page.startDate_tz)

  const startShort = dateISO(page.startDate)
  const endShort = dateISO(page.endDate)

  const artists = (page.featuredArtists as Artist[]).sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  const pressRelease = page.pressRelease as Media

  const checklist = page.checklist as Media

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={'default'} />
      {draft && <LivePreviewListener />}
      <Headline title={page.title}>
        <div className="col-span-full md:col-span-7">
          <time dateTime={`${startShort}/${endShort}`} className="text-xl font-bold">
            {start} — {end}
          </time>
          <address className="text-xl not-italic">{page.location}</address>
        </div>
        {cover && (
          <div className="col-span-full my-2 grid h-auto w-full grid-cols-subgrid md:col-span-5 md:-col-start-6">
            <Image
              src={cover.url}
              width={cover.width}
              height={cover.height}
              alt={cover.alt}
              className="col-span-full"
              sizes="(width >=48rem) 50vw, 100vw"
              loading="eager"
              fetchPriority="high"
            />
            <Caption caption={cover.caption} />
          </div>
        )}
      </Headline>
      <Content>
        {pressRelease && (
          <Link
            className="col-span-6 no-underline md:col-span-4"
            href={pressRelease.url}
            prefetch={false}
          >
            Download Press Release&ensp;<small>(PDF)</small>
          </Link>
        )}
        {checklist && (
          <Link
            className="col-span-6 no-underline md:col-span-4"
            href={checklist.url}
            prefetch={false}
          >
            Download Checklist&ensp;<small>(PDF)</small>
          </Link>
        )}

        {artists.length > 0 && (
          <div className="col-span-full">
            <h2 className="col-span-full m-0 text-xl">Artists</h2>
            <ul className="col-span-full m-0 w-full columns-1 place-self-start sm:columns-2 md:columns-2 lg:columns-3">
              {artists.map((artist) => {
                return (
                  <li key={artist.id}>
                    {artist.isRepresented && (
                      <Link
                        href={{ pathname: `/artists/${artist.slug}` }}
                        className="font-medium text-(--theme-text)"
                      >
                        {artist.title}
                      </Link>
                    )}
                    {!artist.isRepresented && (
                      <span className="font-medium text-(--theme-text)">
                        {artist.title}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {page.content && <PageBlocks data={page.content} />}
      </Content>
    </SubGrid>
  )
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

export const generateViewport = async (
  props: PageProps<'/exhibitions/[slug]'>
): Promise<Viewport> => {
  const { slug } = await props.params
  const payload = await getPayload({ config: configPromise })
  const page = (
    await payload.find({
      collection: 'exhibitions',
      draft: false,
      pagination: false,
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
    })
  ).docs[0]

  const themeColor = colors.find((a) => a.theme === 'default').code

  return {
    themeColor,
  }
}

export default ExhibitionPage
