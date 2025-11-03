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
        | 'viewing-rooms'
        | 'events'
      value: Page | Artist | Exhibition | Press | ViewingRoom | Event
    } | null
    url?: string | null
    upload?: null | Media
    customId?: string | null
  }
}[]

const NavBar: React.FC<{ data: MenuType | null; className: string }> = ({
  data,
  className,
}) => {
  const [theme, setTheme] = useContext(ThemeContext)
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <div
        role="menu"
        className={`flex h-auto flex-col items-center justify-between md:flex-row md:p-0 md:text-center ${className}`}
      >
        {data.map(({ link, label, theme: linkTheme }, i) => {
          const { reference } = link

          let CMSTheme = linkTheme || 'default'

          if (reference && 'theme' in reference.value) {
            CMSTheme = reference.value.theme
          }

          if (link.url === '/events' || link.url === '/newsletter') {
            CMSTheme = theme
          }

          return (
            <CMSLink
              className={`basis-content block min-w-max text-(--theme-text) no-underline md:shrink-0 md:grow md:first:grow-[0.5] md:first:basis-0 md:first:text-left md:last:grow-[0.5] md:last:basis-0 md:last:text-right`}
              key={i}
              {...link}
              onMouseEnter={() => {
                if (isHome) {
                  setTheme(CMSTheme)
                }
              }}
              onMouseLeave={() => {
                if (isHome) {
                  setTheme('default')
                }
              }}
              onNavigate={() => {
                setTheme(CMSTheme)
              }}
              customId={CMSTheme}
              role="menuitem"
            >
              {label}
            </CMSLink>
          )
        })}
      </div>
    </>
  )
}

export default NavBar
