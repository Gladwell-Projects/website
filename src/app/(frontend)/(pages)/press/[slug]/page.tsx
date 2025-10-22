import ThemeSwitch from '../../../_ui/ThemeSwitch'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { fetchPressItem } from '../../../_data'
import Headline from '../../../_ui/Headline'
import Content from '../../../_ui/PageContent'
import SubGrid from '../../../_ui/pageGrid'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { unstable_cache } from 'next/cache'
import { GladwellRichtext as RichText } from '@/components/frontend/lexical'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { colors } from '@/fields/theme'
import { hasText } from '@payloadcms/richtext-lexical/shared'

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

  let content

  if (page.content && hasText(page.content)) {
    content = page.content
  }

  const theme = 'default'

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={theme} />
      {draft && <LivePreviewListener />}
      <Headline title={page.title} />
      <Content>{content && <RichText data={content} />}</Content>
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
