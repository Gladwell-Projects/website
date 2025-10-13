import React from 'react'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import Link from 'next/link'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import Headline from '../../_ui/Headline'
import SubGrid from '../../_ui/pageGrid'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import ArtistList from './components/ArtistList'

const ArtistsPage: React.FC = async () => {
  const { isEnabled: draft } = await draftMode()
  const artistList = draft
    ? await fetchCollection('artists', 'firstName')
    : await unstable_cache(fetchCollection, ['artists'])('artists', 'firstName')

  const slug = '/artists'

  const pageTheme = await currentThemeFromNav(slug)

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Aritsts" />
      <ArtistList data={artistList} />
    </SubGrid>
  )
}

export default ArtistsPage
