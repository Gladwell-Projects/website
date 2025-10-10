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
import { CalendarContext } from '../../_contexts/CalendarOpen'

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
  const [calOpen, setCalOpen] = useContext(CalendarContext)
  const pathname = usePathname()
  const isHome = pathname === '/'

  // @ts-expect-error event
  const handleClick = (event) => {
    if (event.target.innerText === 'Events') {
      event.preventDefault()
      setCalOpen(!calOpen)
    }
    setTheme(theme)
  }

  return (
    <div className="main-nav">
      {data.map(({ link, label, theme }, i) => {
        const { reference } = link

        if (!theme && reference.relationTo === 'pages') {
          // @ts-expect-error we are only finding theme on referenceTo pages
          theme = reference.value.theme
        }

        return (
          <CMSLink
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
