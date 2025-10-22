import React from 'react'
import { currentThemeFromNav, fetchArtists } from '../../_data'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import Headline from '../../_ui/Headline'
import SubGrid from '../../_ui/pageGrid'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import ArtistList from './components/ArtistList'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

const ArtistsPage: React.FC = async () => {
  const { isEnabled: draft } = await draftMode()
  const artistList = draft
    ? await fetchArtists('firstName')
    : await unstable_cache(fetchArtists, ['artists'])('firstName')

  const slug = '/artists'

  const pageTheme = await currentThemeFromNav([slug])

  return (
    <SubGrid>
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Aritsts" />
      <ArtistList data={artistList} />
    </SubGrid>
  )
}

export default ArtistsPage

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
