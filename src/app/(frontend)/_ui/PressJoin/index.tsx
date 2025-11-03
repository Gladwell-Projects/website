import { Exhibition, Press } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { fetchMedia } from '../../_data'
import { dateToLong } from '@/utilities/convertCMSDate'

const PressJoin = (props: { children?: React.ReactNode; data: Partial<Exhibition> }) => {
  const { data, children } = props

  const artistPress = () => {
    const artists = typeof data.featuredArtists === 'object' ? data.featuredArtists : null
    const relatedArtists = artists?.map((artist) => {
      if (typeof artist === 'object') return artist.related.relatedPress.docs
      return null
    })
    return relatedArtists.flat()
  }

  const exhibitionPress = data.related.relatedPress.docs

  const mergedPress = [...exhibitionPress, ...artistPress()]

  const reducedPress = mergedPress?.filter((obj, index, self) => {
    if (typeof obj === 'object')
      return (
        index ===
        self.findIndex((o) => {
          if (typeof o === 'object') return o.id === obj.id
        })
      )
  }) as Press[]

  const sortedPress = reducedPress.sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    return aDate > bDate ? -1 : aDate < bDate ? 1 : 0
  })

  const allPress = sortedPress

  if (allPress.length < 1) {
    return null
  }

  return (
    <div className="col-span-full mt-4 grid grid-cols-subgrid">
      {allPress.length > 0 && <h2 className="col-span-full text-xl">Related Articles</h2>}
      {allPress.map(async (press) => {
        if (typeof press === 'object') {
          let image = press.featuredImage

          if (typeof image === 'string') {
            image = await fetchMedia(image)
          }
          return (
            <div key={press.id} className="col-span-6 md:col-span-4 lg:col-span-3">
              <Link
                href={`/press/${press.slug}`}
                className="text-(--theme-text) no-underline"
              >
                {image && (
                  <Image
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    src={image.url}
                    className="mb-2 aspect-4/3 object-contain"
                  />
                )}
                <div className="strap text-base">{press.strapline}</div>
                <h2 className="mb-0 text-lg">{press.title}</h2>
                <time dateTime={press.date}>{dateToLong(press.date)}</time>
              </Link>
            </div>
          )
        }
        return null
      })}
      {children}
    </div>
  )
}

export default PressJoin
