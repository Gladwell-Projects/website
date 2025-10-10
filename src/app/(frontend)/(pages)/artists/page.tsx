import React from 'react'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import Link from 'next/link'
import ThemeSwitch from '../../_components/ThemeSwitch'
import Headline from '../../_components/Headline'
import SubGrid from '../../_components/pageGrid'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

const ArtistsPage: React.FC = async () => {
  const { isEnabled: draft } = await draftMode()
  const artistList = draft
    ? await fetchCollection('artists', 'lastName')
    : await unstable_cache(fetchCollection, ['artists'])('artists', 'lastName')

  const slug = '/artists'

  const pageTheme = await currentThemeFromNav(slug)

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Aritsts" />
      <ul className="no-link-underline col-span-full grid grid-cols-subgrid">
        {artistList.map((artist) => {
          return (
            <li key={artist.id} className="col-span-4 py-1.5 text-xl">
              <Link href={{ pathname: `/artists/${artist.slug}` }}>
                {artist.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </SubGrid>
  )
}

export default ArtistsPage
