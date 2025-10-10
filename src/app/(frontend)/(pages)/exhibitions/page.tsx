import React from 'react'
import { currentThemeFromNav, fetchCollection } from '../../_data'
import Link from 'next/link'
import ThemeSwitch from '../../_components/ThemeSwitch'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

const Exhibitions = async () => {
  const { isEnabled: draft } = await draftMode()

  const exhibitions = draft
    ? await fetchCollection('exhibitions', 'startDate')
    : await unstable_cache(fetchCollection)('exhibitions', 'startDate')

  const slug = '/exhibitions'

  const pageTheme = await currentThemeFromNav(slug)

  return (
    <div className="col-start-1 -col-end-1 grid grid-cols-subgrid">
      <ThemeSwitch templateTheme={pageTheme} />
      <h1 className="col-start-1 -col-end-1">Exhibitions</h1>
      <ul className="col-start-1 -col-end-1 grid grid-cols-subgrid">
        {exhibitions.length > 0 &&
          exhibitions.map((exhibition) => {
            return (
              <li key={exhibition.id} className="col-span-6 text-xl">
                <Link href={{ pathname: `/exhibitions/${exhibition.slug}` }}>
                  {exhibition.title}
                </Link>
              </li>
            )
          })}
        {exhibitions.length < 1 && (
          <h6 className="col-span-12">Nothing here yet...</h6>
        )}
      </ul>
    </div>
  )
}

export default Exhibitions
