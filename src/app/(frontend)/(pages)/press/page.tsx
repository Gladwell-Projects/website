import { Artist, Exhibition, Media, Press } from '@/payload-types'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Headline from '../../_ui/Headline'
import { CMSLink, CMSLinkType } from '../../_ui/CMSLinks'
import Link from 'next/link'
import Image from 'next/image'

const PressPage: React.FC = async () => {
  const theme = await currentThemeFromNav('/press')
  const items = (await fetchCollection('press', 'date')) as Partial<Press>[]

  if (items.length < 1) {
    return (
      <div className="col-span-full">
        <ThemeSwitch templateTheme={theme} />
        <Headline title="Press" />
        <h6>Nothing to see here yet...</h6>
      </div>
    )
  }

  return (
    <div className="col-span-full md:grid md:grid-cols-subgrid">
      <ThemeSwitch templateTheme={theme} />
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
                  />
                )}
                <RichText data={press.content} />
                <footer className="[&_li]:inline">
                  {relatedExhibitions.length > 0 && (
                    <ul className="text-sm italic">
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

export default PressPage
