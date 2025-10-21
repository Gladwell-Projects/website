'use client'
import { Artist, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const ArtistList = (props: { data: Partial<Artist>[] }) => {
  const { data } = props
  const [currentArtist, setCurrentArtist] = useState<Media | null>(null)

  return (
    <ul className="no-link-underline col-span-full grid grid-cols-subgrid">
      <div className="imgOverlay pointer-events-none fixed inset-0 z-0 col-span-full h-full w-full object-contain">
        {currentArtist && (
          <Image
            src={currentArtist.url}
            width={currentArtist.width}
            height={currentArtist.height}
            alt={currentArtist.alt}
            className="absolute top-[50%] left-[50%] h-full max-h-[50dvh] w-full max-w-[50dvw] -translate-[50%] object-contain"
          />
        )}
      </div>
      {data.map((artist) => {
        const cover =
          artist.profileImage && typeof artist.profileImage === 'object'
            ? artist.profileImage
            : artist.surveyArtworks[0] && typeof artist.surveyArtworks[0] === 'object'
              ? artist.surveyArtworks[0]
              : null

        return (
          <li
            key={artist.id}
            id={artist.id}
            className="z-1 col-span-full w-full py-0 text-xl md:col-span-6 md:py-1.5"
          >
            <Link
              href={{ pathname: `/artists/${artist.slug}` }}
              onMouseEnter={() => setCurrentArtist(cover)}
              onMouseLeave={() => setCurrentArtist(null)}
              className="visited:text-(--theme-link)"
            >
              {artist.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default ArtistList
