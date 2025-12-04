import React from 'react'
import { currentThemeFromNav, fetchExhibitions } from '../../../_data'
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
    ? await fetchExhibitions('-startDate')
    : await unstable_cache(fetchExhibitions)('-startDate')

  const slug = 'exhibitions'

  const pageTheme = await currentThemeFromNav(slug)

  const today = new Date()

  const current = exhibitions.filter((e) => {
    const start = new Date(e.startDate)
    const end = new Date(e.endDate)

    return start <= today && end >= today ? true : false
  })
  const past = exhibitions.filter((e) => {
    const start = new Date(e.startDate)
    const end = new Date(e.endDate)

    return start < today && end < today ? true : false
  })

  const upcoming = exhibitions.filter((e) => {
    const start = new Date(e.startDate)

    return start > today ? true : false
  })

  if (exhibitions.length < 1) {
    return (
      <div className="col-span-full grid grid-cols-subgrid">
        <ThemeSwitch templateTheme={pageTheme} />
        <Headline title="Exhibitions" />
        <h6 className="col-span-12">Nothing here yet...</h6>
      </div>
    )
  }

  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Exhibitions" />
      {current.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h2 className="col-span-full text-lg tracking-widest uppercase">On View</h2>
          <ExhibitionsList exhibitions={current} slug={slug} />
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h2 className="col-span-full text-lg tracking-widest uppercase">
            Upcoming Exhibitions
          </h2>
          <ExhibitionsList exhibitions={upcoming} slug={slug} />
        </div>
      )}

      {past.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h2 className="col-span-full text-lg tracking-widest uppercase">
            Past Exhibitions
          </h2>
          <ExhibitionsList exhibitions={past} slug={slug} />
        </div>
      )}
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
