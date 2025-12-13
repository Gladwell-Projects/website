import ThemeSwitch from '../../../_ui/ThemeSwitch'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { fetchPressItem } from '../../../_data'
import Headline from '../../../_ui/Headline'
import Content from '../../../_ui/PageContent'
import SubGrid from '../../../_ui/pageGrid'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { colors } from '@/fields/theme'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import Image from 'next/image'
import { Caption } from '@/app/(frontend)/_ui/Image'
import Link from 'next/link'
import { Artist, Exhibition } from '@/payload-types'
import { dateToLong } from '@/utilities/convertCMSDate'
import PageBlocks from '@/app/(frontend)/_ui/PageBlocks'

export const generateStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'press',
    draft: false,
    pagination: false,
    limit: 100000,
    depth: 2,
  })
  return pages.docs.map((page) => ({ slug: page.slug }))
}

const getPage = async (slug: string, draft?: boolean) =>
  draft ? fetchPressItem(slug) : unstable_cache(fetchPressItem, [`page-${slug}`])(slug)

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  // const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const page = await getPage(slug, draft)

  if (!page) {
    notFound()
  }

  const theme = 'default'

  const cover =
    page.featuredImage && typeof page.featuredImage === 'object'
      ? page.featuredImage
      : null

  const relatedExhibitions =
    typeof page.relatedExhibitions === 'object'
      ? (page.relatedExhibitions as Exhibition[])
      : null

  const relatedArtists =
    typeof page.relatedArtists === 'object' ? (page.relatedArtists as Artist[]) : null

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={theme} />
      {draft && <LivePreviewListener />}
      {cover && (
        <>
          <Image
            className="col-span-full"
            src={cover.url}
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            sizes="95vw"
            loading="eager"
          />
          {hasText(cover.caption) && <Caption caption={cover.caption}></Caption>}
        </>
      )}
      <Headline title={null} className="**:col-span-full!">
        <h1>
          {page.strapline && (
            <span className="m-0 inline-block w-full text-xl">{page.strapline}</span>
          )}
          {page.title}
        </h1>
        <aside className="col-span-full md:col-span-6 [&_li]:inline">
          <time
            className="align-top text-sm font-bold tracking-widest uppercase"
            dateTime={page.date}
          >
            {dateToLong(page.date)}
          </time>
          {relatedExhibitions.length > 0 && (
            <ul className="m-0 block list-none p-0 align-top italic">
              <li className="pr-2 text-sm font-normal tracking-widest uppercase not-italic">
                Exhibitions:
              </li>
              {relatedExhibitions.map((e, i) => {
                return (
                  <li key={e.id}>
                    {i > 0 && <span className="px-1 font-bold not-italic">&bull;</span>}
                    <Link href={{ pathname: `/exhibitions/${e.slug}` }}>{e.title}</Link>
                  </li>
                )
              })}
            </ul>
          )}

          {relatedArtists.length > 0 && (
            <ul className="list-none text-sm italic">
              <li className="pr-2 text-sm font-normal tracking-widest uppercase not-italic">
                Artists:
              </li>
              {relatedArtists.map((e, i) => {
                return (
                  <li key={e.id}>
                    {i > 0 && <span className="px-1 font-bold not-italic">&bull;</span>}
                    {e.isRepresented ? (
                      <Link href={{ pathname: `/artists/${e.slug}` }}>{e.title}</Link>
                    ) : (
                      e.title
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
      </Headline>
      <Content>
        <PageBlocks data={page.contentBlocks} />
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
  const page = await fetchPressItem(decodedSlug)

  return generateMeta({ doc: page, colSlug: '/press' })
}

export const generateViewport = async (
  props: PageProps<'/[slug]'>
): Promise<Viewport> => {
  const { slug } = await props.params
  const payload = await getPayload({ config: configPromise })
  const page = (
    await payload.find({
      collection: 'pages',
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

  if (!page) {
    return null
  }

  const pageTheme = 'theme' in page ? page.theme : 'default'

  const themeColor = colors.find((a) => a.theme === pageTheme).code

  return {
    themeColor,
  }
}

export default Page
