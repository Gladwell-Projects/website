import { Metadata } from 'next'
import CalendarPopup from '../../_ui/CalendarPopUp'
import Headline from '../../_ui/Headline'
import { generateMeta } from '@/utilities/generateMeta'
import React from 'react'
import { currentThemeFromNav } from '@/app/(frontend)/_data/theme'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { fetchTopLevelTitle } from '../../_data'

const EventsPage = async () => {
  const slug = 'events'

  const title = await fetchTopLevelTitle(slug)
  const pageTheme = await currentThemeFromNav(slug)

  return (
    <div className="col-span-full grid w-full grid-cols-subgrid gap-3">
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title={title} className="col-span-full row-start-1 w-full" />
      <CalendarPopup hasClose={false} />
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
    slug: '/events',
    meta: {
      title: 'Events | Gladwell Projects',
      description: 'Events hosted by Gladwell Projects',
    },
  }

  return generateMeta({ doc: page })
}

export default EventsPage
