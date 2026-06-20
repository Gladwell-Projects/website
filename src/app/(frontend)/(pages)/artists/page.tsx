import React from 'react'
import { fetchArtists, fetchTopLevelTitle } from '../../_data'
import { currentThemeFromNav } from '@/app/(frontend)/_data/theme'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import Headline from '../../_ui/Headline'
import SubGrid from '../../_ui/pageGrid'
import ArtistList from './components/ArtistList'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

const ArtistsPage: React.FC = async () => {
  const artistList = await fetchArtists('firstName')

  const slug = '/artists'

  const pageTheme = await currentThemeFromNav(slug)

  const title = await fetchTopLevelTitle(slug)

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title={title} />
      <ArtistList data={artistList} />
    </SubGrid>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/artists',
    meta: {
      title: 'Artists | Gladwell Projects',
      description: 'Artists represented by Gladwell Projects',
    },
  }

  return generateMeta({ doc: page })
}

export default ArtistsPage
