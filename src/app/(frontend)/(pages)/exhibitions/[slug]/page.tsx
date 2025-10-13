import React from 'react'
import { fetchDocument } from '../../../_data'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ThemeSwitch from '@/app/(frontend)/_ui/ThemeSwitch'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import SubGrid from '@/app/(frontend)/_ui/pageGrid'
import Headline from '@/app/(frontend)/_ui/Headline'
import Content from '@/app/(frontend)/_ui/PageContent'
import { unstable_cache } from 'next/cache'
import { Exhibition, Media } from '@/payload-types'
import Image from 'next/image'
import { dateISO, dateToLong } from '@/app/(frontend)/_helpers/convertCMSDate'

const ExhibitionPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { isEnabled: draft } = await draftMode()

  const { slug } = await params

  const page: Partial<Exhibition> = draft
    ? await fetchDocument('exhibitions', slug)
    : await unstable_cache(fetchDocument)('exhibitions', slug)

  if (!page) {
    notFound()
  }

  const cover = page.coverImage ? (page.coverImage as Media) : null
  const start = dateToLong(page.startDate, page.startDate_tz)
  const end = dateToLong(page.endDate, page.startDate_tz)

  const startShort = dateISO(page.startDate)
  const endShort = dateISO(page.endDate)

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
          <Image
            src={cover.url}
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            className="col-span-full my-2 h-auto w-full md:col-span-5 md:-col-start-6"
          />
        )}
      </Headline>
      <Content>{page.content && <RichText data={page.content} />}</Content>
    </SubGrid>
  )
}

export default ExhibitionPage
