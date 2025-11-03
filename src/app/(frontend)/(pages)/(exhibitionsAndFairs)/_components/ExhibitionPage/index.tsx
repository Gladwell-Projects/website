import { Caption } from '@/app/(frontend)/_ui/Image'
import PageBlocks from '@/app/(frontend)/_ui/PageBlocks'
import SubGrid from '@/app/(frontend)/_ui/pageGrid'
import ThemeSwitch from '@/app/(frontend)/_ui/ThemeSwitch'
import { LivePreviewListener } from '@/components/frontend/LivePreviewListener'
import { Artist, Exhibition } from '@/payload-types'
import { dateToLong, dateISO } from '@/utilities/convertCMSDate'
import Content from '@/app/(frontend)/_ui/PageContent'
import Link from 'next/link'

import Image from 'next/image'
import Headline from '@/app/(frontend)/_ui/Headline'

const ExhibitionContent = (props: {
  page: Partial<Exhibition>
  draft: boolean
  children?: React.ReactNode
}) => {
  const { page, draft, children } = props

  const cover =
    page.featuredImg && typeof page.featuredImg === 'object'
      ? page.featuredImg
      : page.coverImage && typeof page.coverImage === 'object'
        ? page.coverImage
        : null

  const start = dateToLong(page.startDate, page.startDate_tz)
  const end = dateToLong(page.endDate, page.startDate_tz)

  const startShort = dateISO(page.startDate)
  const endShort = dateISO(page.endDate)

  const artists = (page.featuredArtists as Artist[]).sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  const pressRelease =
    page.pressRelease && typeof page.pressRelease === 'object' ? page.pressRelease : false

  const checklist =
    page.checklist && typeof page.checklist === 'object' ? page.checklist : false

  const preview =
    page.previewPdf && typeof page.previewPdf === 'object' ? page.previewPdf : false

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
            {cover.caption && <Caption caption={cover.caption} />}
          </div>
        )}
      </Headline>
      <Content>
        {pressRelease && (
          <Link
            className="col-span-6 no-underline md:col-span-4"
            href={pressRelease.url}
            prefetch={false}
            target="_blank"
          >
            Press Release&ensp;<small>(PDF)</small>
          </Link>
        )}
        {checklist && (
          <Link
            className="col-span-6 no-underline md:col-span-4"
            href={checklist.url}
            prefetch={false}
            target="_blank"
          >
            Checklist&ensp;<small>(PDF)</small>
          </Link>
        )}
        {preview && (
          <Link
            className="col-span-6 no-underline md:col-span-4"
            href={preview.url}
            prefetch={false}
            target="_blank"
          >
            Preview&ensp;<small>(PDF)</small>
          </Link>
        )}

        {artists.length > 0 && (
          <div className="col-span-full">
            <h2 className="col-span-full m-0 text-xl">Artists</h2>
            <ul className="col-span-full m-0 w-full columns-1 place-self-start p-0 sm:columns-2 md:columns-2 lg:columns-3">
              {artists.map((artist) => {
                return (
                  <li key={artist.id} className="list-none p-0">
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
        {children}
      </Content>
    </SubGrid>
  )
}

export default ExhibitionContent
