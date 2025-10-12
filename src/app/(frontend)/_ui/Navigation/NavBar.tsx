'use client'
import { CMSLink } from '../CMSLinks'
import { useContext } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'
import {
  Artist,
  Exhibition,
  Media,
  Page,
  Press,
  ViewingRoom,
  Event,
} from '@/payload-types'
import { usePathname } from 'next/navigation'

type MenuType = {
  label: string
  theme: string
  link?: {
    type?: 'custom' | 'upload' | 'reference'
    newTab?: boolean
    reference?: {
      relationTo:
        | 'pages'
        | 'artists'
        | 'exhibitions'
        | 'press'
        | 'viewingRooms'
        | 'events'
      value: Page | Artist | Exhibition | Press | ViewingRoom | Event
    } | null
    url?: string | null
    upload?: null | Media
    customId?: string | null
  }
}[]

const NavBar: React.FC<{ data: MenuType | null }> = ({ data }) => {
  const [theme, setTheme] = useContext(ThemeContext)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const handleClick = () => {
    setTheme(theme)
  }

  return (
    <div className="grid h-auto grid-flow-row auto-rows-auto md:auto-cols-fr md:grid-flow-col md:grid-rows-[var(--text-base--line-height)] md:p-0 md:text-center">
      {data.map(({ link, label, theme }, i) => {
        const { reference } = link

        if (!theme && reference.relationTo === 'pages') {
          // @ts-expect-error we are only finding theme on referenceTo pages
          theme = reference.value.theme
        }

        return (
          <CMSLink
            className="text-[var(--theme-text)] no-underline md:first:text-left md:last:text-right"
            key={i}
            {...link}
            onMouseEnter={() => {
              if (isHome) {
                setTheme(theme)
              }
            }}
            onMouseLeave={() => {
              if (isHome) {
                setTheme('default')
              }
            }}
            onClick={handleClick}
          >
            {label}
          </CMSLink>
        )
      })}
    </div>
  )
}

export default NavBar
