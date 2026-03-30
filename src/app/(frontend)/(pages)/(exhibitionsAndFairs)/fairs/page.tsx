import React from 'react'
import { fetchFairs, fetchTopLevelTitle } from '../../../_data'
import { currentThemeFromNav } from '@/app/(frontend)/_data/theme'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Exhibition } from '@/payload-types'
import ExhibitionsList from '../_components/ExhibitionList'
import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import Headline from '../../../_ui/Headline'
import ThemeSwitch from '../../../_ui/ThemeSwitch'
import { colors } from '@/fields/theme'

const Exhibitions = async () => {
  const { isEnabled: draft } = await draftMode()

  const exhibitions: Partial<Exhibition>[] = draft
    ? await fetchFairs('startDate')
    : await unstable_cache(fetchFairs)('startDate')

  const slug = '/fairs'

  const title = await fetchTopLevelTitle(slug)

  const pageTheme = await currentThemeFromNav(slug)

  if (exhibitions.length < 1) {
    return (
      <div className="col-span-full grid grid-cols-subgrid">
        <ThemeSwitch templateTheme={pageTheme} />
        <Headline title={title} />
        <h6 className="col-span-12">Nothing here yet...</h6>
      </div>
    )
  }

  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title={title} />
      <div className="exhibition-list col-span-full grid grid-cols-subgrid">
        <ExhibitionsList exhibitions={exhibitions} slug={slug} />
      </div>
    </div>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/exhibitions',
    meta: {
      title: 'Exhibitions | Gladwell Projects',
      description: 'Gladwell Projects Exhibitions',
    },
  }

  return generateMeta({ doc: page })
}

export const generateViewport = async (): Promise<Viewport> => {
  const slug = 'exhibitions'
  const pageTheme = await currentThemeFromNav(slug)
  const themeColor = colors.find((a) => a.theme === pageTheme).code

  return {
    themeColor,
  }
}

export default Exhibitions
