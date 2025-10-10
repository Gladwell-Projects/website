import React from 'react'
import { fetchDocument } from '../../../_data'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ThemeSwitch from '@/app/(frontend)/_components/ThemeSwitch'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import SubGrid from '@/app/(frontend)/_components/pageGrid'
import Headline from '@/app/(frontend)/_components/Headline'
import Content from '@/app/(frontend)/_components/PageContent'
import { unstable_cache } from 'next/cache'
import { Exhibition } from '@/payload-types'

const ExhibitionPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { isEnabled: draft } = await draftMode()

  const { slug } = await params

  const page: Partial<Exhibition> = draft
    ? await fetchDocument('exhibitions', slug)
    : await unstable_cache(fetchDocument)('exhibitions', slug)

  if (!page) {
    notFound()
  }

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={'default'} />
      {draft && <LivePreviewListener />}
      <Headline title={page.title} />
      <Content>{page.content && <RichText data={page.content} />}</Content>
    </SubGrid>
  )
}

export default ExhibitionPage
