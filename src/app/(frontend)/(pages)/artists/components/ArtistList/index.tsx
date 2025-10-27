'use client'
import { Artist, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ArtistList = (props: { data: Partial<Artist>[] }) => {
  const { data } = props
  const [currentArtist, setCurrentArtist] = useState<string>(null)

  return (
    <>
      <ul className="no-link-underline col-span-full grid grid-cols-subgrid">
        {data.map((artist) => {
          return (
            <li
              key={artist.id}
              id={artist.id}
              className="z-0 col-span-full w-full py-0 text-xl hover:z-9999 md:col-span-6 md:py-1.5"
            >
              <Link
                href={{ pathname: `/artists/${artist.slug}` }}
                onMouseEnter={() => setCurrentArtist(artist.id)}
                onMouseLeave={() => setCurrentArtist(null)}
                className="visited:text-(--theme-link)"
              >
                {artist.title}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="pointer-events-none fixed inset-0 z-99 col-span-full h-full w-full object-contain">
        {data.map((artist) => {
          const cover =
            artist.profileImage && typeof artist.profileImage === 'object'
              ? artist.profileImage
              : artist.surveyArtworks[0] && typeof artist.surveyArtworks[0] === 'object'
                ? artist.surveyArtworks[0]
                : null
          return (
            <div key={artist.id} className="contents">
              {cover && (
                <Image
                  src={cover.url}
                  width={cover.width}
                  height={cover.height}
                  alt={cover.alt}
                  sizes="100vw"
                  quality="80"
                  loading="eager"
                  className={`${currentArtist === artist.id ? 'opacity-100' : 'opacity-0'} fixed top-0 left-0 h-screen w-screen object-cover transition-opacity duration-75`}
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ArtistList
