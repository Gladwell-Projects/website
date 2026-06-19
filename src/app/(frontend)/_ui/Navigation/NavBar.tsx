'use client'
import { CMSLink } from '../CMSLinks'
import { useEffect } from 'react'
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
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Clear any lingering hover override if the route changes before
  // onMouseLeave fires (e.g. keyboard nav or programmatic navigation).
  useEffect(() => {
    delete document.documentElement.dataset.hoverTheme
  }, [pathname])

  return (
    <>
      <div
        role="menu"
        className={`flex h-auto flex-col justify-between leading-none md:flex-row md:items-center md:gap-0 md:p-0 md:text-center ${className}`}
      >
        {data.map(({ link, label, theme: linkTheme }, i) => {
          const { reference } = link

          // Theme is chosen by the Direct Link `type`, never by a stale stored
          // value. A reference link inherits the linked document's theme, and
          // falls back to 'default' when the reference is missing/invalid or
          // the document has no theme field (e.g. Press/Exhibition/Event/Artist
          // references — only Pages and Viewing Rooms have themes). Custom URL
          // and document/upload links use the menu item's own theme. This is
          // what prevents stale DB data — e.g. a reference left over from a
          // previous "custom" link — from leaking a wrong theme like "glow".
          let CMSTheme = 'default'

          if (link.type === 'reference') {
            if (
              reference &&
              typeof reference.value === 'object' &&
              reference.value !== null &&
              'theme' in reference.value &&
              reference.value.theme
            ) {
              CMSTheme = reference.value.theme
            }
          } else if (link.type === 'custom' || link.type === 'upload') {
            CMSTheme = linkTheme || 'default'
          }

          return (
            <CMSLink
              className={`block min-w-max basis-0 py-2 text-(--theme-text) no-underline md:shrink md:grow md:p-0 md:first:grow-[0.5] md:first:text-left md:last:grow-[0.5] md:last:text-right`}
              key={i}
              {...link}
              onMouseEnter={() => {
                if (isHome) {
                  document.documentElement.dataset.hoverTheme = CMSTheme
                }
              }}
              onMouseLeave={() => {
                if (isHome) {
                  delete document.documentElement.dataset.hoverTheme
                }
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
