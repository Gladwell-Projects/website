import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { fetchPage } from '../../_data'
import Headline from '../../_ui/Headline'
import Content from '../../_ui/PageContent'
import SubGrid from '../../_ui/pageGrid'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { unstable_cache } from 'next/cache'

const getPage = async (slug: string[], draft?: boolean) =>
  draft ? fetchPage(slug) : unstable_cache(fetchPage, [`page-${slug}`])(slug)

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  // const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const page = await getPage(slug, draft)

  if (!page) {
    notFound()
  }

  let theme = 'default'

  if (page) {
    theme = page.theme
  }

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={theme} />
      {draft && <LivePreviewListener />}
      <Headline title={page.title} />
      <Content>{page.content && <RichText data={page.content} />}</Content>
    </SubGrid>
  )
}

export default Page
