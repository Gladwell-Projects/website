import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { Artist, Exhibition, Media, Press } from '@/payload-types'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Headline from '../../_ui/Headline'
import { CMSLink } from '../../_ui/CMSLinks'
import Link from 'next/link'
import Image from 'next/image'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { colors } from '@/fields/theme'

const PressPage: React.FC = async () => {
  const items = (await fetchCollection('press', 'date')) as Partial<Press>[]

  const slug = 'press'

  const pageTheme = await currentThemeFromNav(slug)

  if (items.length < 1) {
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
      <ul className="md:col-span-full md:grid md:grid-cols-subgrid">
        {items.map((press) => {
          const relatedExhibitions = press.relatedExhibitions as Partial<Exhibition>[]
          const relatedArtists = press.relatedArtists as Partial<Artist>[]
          const links = press.links
          const image = press.featuredImage as Media
          return (
            <li key={press.id} className="md:col-span-full md:grid md:grid-cols-subgrid">
              <div className="md:col-span-6">
                {press.strapline && <h6>{press.strapline}</h6>}
                <h2>{press.title}</h2>
              </div>
              <div className="md:col-span-6">
                {press.featuredImage && (
                  <Image
                    src={image.url}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    sizes="(max-width: 448px) 100vw, 50vw"
                  />
                )}
                <div className="relative">
                  <div className="absolute bottom-0 m-0 h-8 w-full bg-linear-to-t from-(color:--theme-bg) to-transparent"></div>
                  <RichText
                    data={press.content}
                    className="max-h-[--spacing(65)] max-w-full overflow-hidden overflow-ellipsis"
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
                            <Link href={{ pathname: `/artists/${e.slug}` }}>
                              {e.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  <ul className="font-bold not-italic">
                    <li className="pr-2 text-sm font-normal tracking-widest uppercase">
                      Read More:
                    </li>
                    {links.map((link, i) => {
                      return (
                        <li key={link.id}>
                          {i > 0 && <span className="px-1 font-bold"> &bull; </span>}
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
