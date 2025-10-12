'use client'
import { MainMenu } from '@/payload-types'
import Logo from './Logo'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'

const Navigation = (props: {
  navTemplate: 'condensed' | 'spread' | string | null
  data: MainMenu
}) => {
  const { data: nav, navTemplate } = props

  const [isVisible, setVisible] = useState(true)

  useEffect(() => {
    let lastScroll = window.scrollY
    document.addEventListener('scroll', () => {
      const navHeight = document.getElementsByTagName('nav')[0].clientHeight
      if (window.scrollY <= navHeight) {
        setVisible(true)
      } else {
        if (window.scrollY < lastScroll - 200) {
          // Scrolling Up
          setVisible(true)
          lastScroll = window.scrollY
        } else if (window.scrollY > lastScroll + 50) {
          // Scrolling Down
          setVisible(false)
          lastScroll = window.scrollY
        }
      }
    })
  })

  return (
    <nav
      className={`page-nav ${!isVisible && 'nav-not-visible'} ${navTemplate === 'spread' && 'min-h-[calc(100dvh - --spacing(2)] relative col-span-full w-full grid-rows-3 p-0 md:grid-rows-[var(--text-base--line-height)_1fr_var(--text-base--line-height)]'} ${navTemplate === 'condensed' && 'grid-rows-3 gap-0.5 bg-gradient-to-b from-(--theme-bg) from-70% to-transparent p-2 pb-6'} fixed top-0 left-0 z-99 m-0 grid w-dvw text-center transition-transform`}
    >
      <Logo className={`${navTemplate === 'spread' && 'row-start-2'}`} />
      {/* @ts-expect-error type number problem with database schema  */}
      <NavBar data={nav['menu-items-top']} />
      {/* @ts-expect-error type number problem with database schema  */}
      <NavBar data={nav['menu-items-bot']} />
    </nav>
  )
}

export default Navigation
