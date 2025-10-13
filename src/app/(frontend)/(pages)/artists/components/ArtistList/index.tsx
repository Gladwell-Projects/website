'use client'
import { Artist } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const ArtistList = (props: { data: Partial<Artist>[] }) => {
  const { data } = props
  const [currentArtist, setCurrentArtist] = useState(null)

  return (
    <ul className="no-link-underline relative col-span-full grid grid-cols-subgrid">
      {currentArtist && (
        <Image
          src={currentArtist.url}
          width={currentArtist.width}
          height={currentArtist.height}
          alt={currentArtist.alt}
          className="absolute inset-0 z-0 col-span-full h-full w-full object-contain"
        />
      )}
      {data.map((artist) => {
        return (
          <li
            key={artist.id}
            className="z-1 col-span-full w-full py-0 text-xl md:col-span-6 md:py-1.5"
          >
            <Link
              href={{ pathname: `/artists/${artist.slug}` }}
              onMouseEnter={() => setCurrentArtist(artist.profileImage || null)}
              onMouseLeave={() => setCurrentArtist(null)}
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
