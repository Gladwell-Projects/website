import React from 'react'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Exhibition } from '@/payload-types'
import ExhibitionsList from './components/ExhibitionList'

const Exhibitions = async () => {
  const { isEnabled: draft } = await draftMode()

  const exhibitions: Partial<Exhibition>[] = draft
    ? await fetchCollection('exhibitions', 'startDate')
    : await unstable_cache(fetchCollection)('exhibitions', 'startDate')

  const slug = '/exhibitions'

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

        <h1 className="col-span-full">Exhibitions</h1>
        <h6 className="col-span-12">Nothing here yet...</h6>
      </div>
    )
  }

  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <ThemeSwitch templateTheme={pageTheme} />
      <h1 className="col-span-full">Exhibitions</h1>
      {current.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h2 className="col-span-full">Currently on View</h2>
          <ExhibitionsList exhibitions={current} />
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h3 className="col-span-full">Upcoming</h3>
          <ExhibitionsList exhibitions={upcoming} />
        </div>
      )}

      {past.length > 0 && (
        <div className="exhibition-list col-span-full grid grid-cols-subgrid">
          <h3>Archive</h3>
          <ExhibitionsList exhibitions={past} />
        </div>
      )}
    </div>
  )
}

export default Exhibitions
