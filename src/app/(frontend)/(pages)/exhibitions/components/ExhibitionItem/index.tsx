import { dateToLong } from '@/utilities/convertCMSDate'
import { Artist, Exhibition, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'

const ExhibitionItem = ({ exhibition }: { exhibition: Partial<Exhibition> }) => {
  const artists = exhibition.featuredArtists as Partial<Artist>[]

  const cover = exhibition.coverImage as Partial<Media>

  const start = dateToLong(exhibition.startDate, exhibition.startDate_tz)

  const end = dateToLong(exhibition.endDate, exhibition.endDate_tz)

  return (
    <li className="group relative col-span-full -mx-2 grid grid-cols-subgrid overflow-hidden px-2 py-6">
      <Link
        href={{ pathname: `/exhibitions/${exhibition.slug}` }}
        className="col-span-full grid w-full grid-cols-subgrid text-(--theme-link) no-underline"
      >
        {cover && (
          <Image
            width={cover.width}
            height={cover.height}
            src={cover.url}
            alt={cover.alt}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute -inset-5 z-0 origin-left scale-x-100 bg-linear-to-r from-(--theme-bg) from-50% to-transparent transition-transform group-hover:scale-x-70 group-hover:transition-transform md:scale-x-200 group-hover:md:scale-x-50"></div>
        <div className="z-1 col-span-full grid w-full grid-cols-subgrid place-items-start text-shadow-[1px_-1px_0px_var(--theme-bg)]">
          <div className="col-span-full grid auto-rows-auto grid-cols-subgrid place-items-start md:-col-end-2">
            <h2 className="col-span-full">{exhibition.title}</h2>
            <div className="col-span-full md:col-span-6">
              <div>
                {start} &mdash; {end}
              </div>
              <div>
                {artists
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((a, i) => {
                    return (
                      <span key={a.id}>
                        {a.title}
                        {i < artists.length - 1 ? ', ' : ''}
                      </span>
                    )
                  })}
              </div>
            </div>
          </div>
          <div className="col-span-full place-self-center-safe justify-self-start text-left text-3xl md:col-span-1 md:-col-start-1 md:row-span-full lg:text-4xl">
            &rarr;
          </div>
        </div>
      </Link>
    </li>
  )
}

export default ExhibitionItem
