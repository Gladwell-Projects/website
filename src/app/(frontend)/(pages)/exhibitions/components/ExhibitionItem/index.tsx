import { dateToLong } from '@/app/(frontend)/_helpers/convertCMSDate'
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
        className="col-span-full grid w-full grid-cols-subgrid text-(--theme-text) no-underline"
      >
        {cover && (
          <Image
            width={cover.width}
            height={cover.height}
            src={cover.url}
            alt={cover.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 z-0 origin-left scale-x-200 bg-linear-to-r from-(--theme-bg) from-50% to-transparent transition-transform group-hover:scale-x-70 group-hover:transition-transform group-hover:md:scale-x-50"></div>
        <div className="z-1 col-span-full grid w-full grid-cols-subgrid place-items-start text-shadow-[1px_-1px_0px_var(--color-blue)]">
          <div className="col-start-1 -col-end-3 grid auto-rows-auto grid-cols-subgrid place-items-start md:-col-end-2">
            <h3 className="col-span-full">{exhibition.title}</h3>
            <div className="col-span-6">
              <div>
                {start} &mdash; {end}
              </div>
              <div>
                {artists.map((a, i) => {
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
          <div className="col-span-2 -col-start-3 row-span-full place-self-center-safe justify-self-start text-right text-4xl md:col-span-1 md:-col-start-1 lg:text-5xl">
            &rarr;
          </div>
        </div>
      </Link>
    </li>
  )
}

export default ExhibitionItem
