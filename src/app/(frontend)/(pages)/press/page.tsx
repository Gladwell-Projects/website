import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { Artist, Exhibition, Media } from '@/payload-types'
import { currentThemeFromNav, fetchPress } from '../../_data'
import { GladwellRichtext as RichText } from '@/components/frontend/lexical'
import Headline from '../../_ui/Headline'
import { CMSLink } from '../../_ui/CMSLinks'
import Link from 'next/link'
import Image from 'next/image'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { colors } from '@/fields/theme'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { dateToLong } from '@/utilities/convertCMSDate'

const PressPage: React.FC = async () => {
  const { isEnabled: draft } = await draftMode()
  const page = draft
    ? await fetchPress()
    : await unstable_cache(fetchPress, ['artists'])()

  const slug = '/press'

  const pageTheme = await currentThemeFromNav(slug)

  if (page.length < 1) {
    return (
      <div className="col-span-full">
        <ThemeSwitch templateTheme={pageTheme} />
        <Headline title="Press" />
        <h6>Nothing to see here yet...</h6>
      </div>
    )
  }

  return (
    <div className="col-span-full md:grid md:grid-cols-subgrid">
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Press" className="md:col-span-full" />
      <ul className="col-span-full grid grid-cols-subgrid gap-y-8">
        {page.map((press) => {
          const relatedExhibitions = press.relatedExhibitions as Partial<Exhibition>[]
          const relatedArtists = press.relatedArtists as Partial<Artist>[]
          const links = press.links
          const image = press.featuredImage as Media
          return (
            <li key={press.id} className="md:col-span-full md:grid md:grid-cols-subgrid">
              <div className="md:col-span-6">
                {press.strapline && (
                  <strong className="text-base tracking-widest uppercase">
                    {press.strapline}
                  </strong>
                )}
                <h2 className="text-2xl">{press.title}</h2>
                <time
                  className="align-top text-sm font-bold tracking-widest uppercase"
                  dateTime={press.date}
                >
                  {dateToLong(press.date)}
                </time>
              </div>
              <div className="md:col-span-6">
                {press.featuredImage && (
                  <Image
                    src={image.url}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    sizes="(width >=48rem) 50vw, 100vw"
                    className="my-4"
                  />
                )}
                <div className="relative">
                  <div className="absolute bottom-0 m-0 h-8 w-full bg-linear-to-t from-(--theme-bg) to-transparent"></div>
                  <RichText
                    data={press.content}
                    className="max-h-65 max-w-full overflow-hidden overflow-ellipsis"
                  ></RichText>
                </div>
                <footer className="[&_li]:inline">
                  {relatedExhibitions.length > 0 && (
                    <ul className="italic">
                      <li className="pr-2 text-sm font-normal tracking-widest uppercase not-italic">
                        Exhibitions:
                      </li>
                      {relatedExhibitions.map((e, i) => {
                        return (
                          <li key={e.id}>
                            {i > 0 && (
                              <span className="px-1 font-bold not-italic">&bull;</span>
                            )}
                            <Link href={{ pathname: `/exhibitions/${e.slug}` }}>
                              {e.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {relatedArtists.length > 0 && (
                    <ul className="text-sm italic">
                      <li className="pr-2 text-sm font-normal tracking-widest uppercase not-italic">
                        Artists:
                      </li>
                      {relatedArtists.map((e, i) => {
                        return (
                          <li key={e.id}>
                            {i > 0 && (
                              <span className="px-1 font-bold not-italic">&bull;</span>
                            )}
                            {e.isRepresented ? (
                              <Link href={{ pathname: `/artists/${e.slug}` }}>
                                {e.title}
                              </Link>
                            ) : (
                              e.title
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  <ul className="font-bold not-italic">
                    <li>
                      <Link href={`/press/${press.slug}`}>Continue Reading</Link>
                    </li>
                    {links.map((link) => {
                      return (
                        <li key={link.id}>
                          <span className="px-1 font-bold"> &bull; </span>
                          {/* @ts-expect-error cms links number error... */}
                          <CMSLink {...link.link}> ↗</CMSLink>
                        </li>
                      )
                    })}
                  </ul>
                </footer>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/press',
    meta: {
      title: 'Press | Gladwell Projects',
      description: 'Gladwell Projects in the Press',
    },
  }

  return generateMeta({ doc: page })
}

export const generateViewport = async (): Promise<Viewport> => {
  const slug = 'press'
  const pageTheme = await currentThemeFromNav(slug)
  const themeColor = colors.find((a) => a.theme === pageTheme).code

  return {
    themeColor,
  }
}

export default PressPage
