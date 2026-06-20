import ThemeSwitch from '../../../_ui/ThemeSwitch'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { fetchViewingRoom, getPayloadClient } from '../../../_data'
import Headline from '../../../_ui/Headline'
import Content from '../../../_ui/PageContent'
import SubGrid from '../../../_ui/pageGrid'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import PageBlocks from '../../../_ui/PageBlocks'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { themeCode } from '@/fields/theme'

export const generateStaticParams = async () => {
  const payload = await getPayloadClient()
  const pages = await payload.find({
    collection: 'viewingRooms',
    draft: false,
    pagination: false,
    limit: 100000,
    depth: 2,
  })
  return pages.docs.map((page) => ({ slug: page.slug }))
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  // const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const page = await fetchViewingRoom(slug)

  if (!page) {
    notFound()
  }

  let content

  if (page.content && page.content.length > 0) {
    content = page.content
  }

  let theme = 'default'

  if (page) {
    theme = page.theme || 'default'
  }

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={theme} />
      {draft && <LivePreviewListener />}
      <Headline title={page.title} />
      <Content>{content && <PageBlocks data={content} />}</Content>
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
  const page = await fetchViewingRoom(decodedSlug)

  return generateMeta({ doc: page, colSlug: '/viewing-rooms' })
}

export const generateViewport = async (
  props: PageProps<'/viewing-rooms/[slug]'>
): Promise<Viewport> => {
  const { slug } = await props.params
  const payload = await getPayloadClient()
  const page = (
    await payload.find({
      collection: 'viewingRooms',
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

  const pageTheme = page.theme

  const themeColor = themeCode(pageTheme)

  return {
    themeColor,
  }
}

export default Page
