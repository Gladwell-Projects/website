'use client'
import { MainMenu } from '@/payload-types'
import Logo from './Logo'
import NavBar from './NavBar'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import HamburgerIcon from './HamburgerIcon'

const Navigation = (props: {
  navTemplate: 'condensed' | 'spread' | string | null
  data: MainMenu
}) => {
  const { data: nav, navTemplate } = props

  const pathname = usePathname()

  const [isVisible, setVisible] = useState(true)

  const [isOpen, setOpen] = useState(false)
  const [screenMd, setScreenMd] = useState(false)
  const [navMaxHeight, setNavMaxHeight] = useState(0)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!screenMd && navTemplate !== 'spread') {
      const navs = [...document.querySelectorAll('#navbars div')]
      const navHeights = navs.map((a) => a.clientHeight)
      setNavMaxHeight(navHeights.reduce((a, b) => a + b))
    }
  }, [setNavMaxHeight, navMaxHeight, screenMd, isOpen, navTemplate])

  useEffect(() => {
    const style =
      'font-family:verdana, sans-serif; font-weight:normal; font-style:italic; font-size: 1.25em; margin:1em;'
    console.log('%cSite by Nathan Wong', style)

    const checkScreenSize = () => {
      setScreenMd(window.innerWidth > 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    let lastScroll = window.scrollY
    const navHeight = document.getElementsByTagName('nav')[0].clientHeight
    const scrollListener = () => {
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
    }
    document.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
      document.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    // Navigation, pull request
    <nav
      className={`page-nav ${!isVisible && 'nav-not-visible'} fixed top-0 left-0 z-99 m-0 grid w-dvw gap-2 text-center transition-all md:grid-cols-1 md:gap-0.5 ${navTemplate === 'spread' && 'min-h-[calc(100dvh - --spacing(2)] relative col-span-full w-full grid-rows-[1fr_--spacing(28)_1fr] p-0 md:grid-rows-[var(--text-base--line-height)_1fr_var(--text-base--line-height)]'} ${navTemplate === 'condensed' && `${!screenMd && 'grid-cols-2'} auto-rows-min bg-linear-to-b from-(--theme-bg) from-90% to-transparent p-2 pb-0 md:auto-rows-fr md:pb-2`}`}
    >
      <style>{`:root{--nav-max-height: ${navMaxHeight}px}`}</style>
      <Logo
        className={`${navTemplate === 'spread' && 'row-start-2'} md:pb-1`}
        variant={screenMd ? 'spread' : navTemplate === 'spread' ? 'spread' : 'stacked'}
      />
      {!screenMd && navTemplate !== 'spread' && (
        <HamburgerIcon
          isOpen={isOpen}
          className="open cursor-pointer grid-cols-6 self-center justify-self-end"
          onClick={() => setOpen(!isOpen)}
        />
      )}
      {screenMd || navTemplate === 'spread' ? (
        <>
          {/* @ts-expect-error type number problem with database schema  */}
          <NavBar data={nav['menu-items-top']} />
          {/* @ts-expect-error type number problem with database schema  */}
          <NavBar data={nav['menu-items-bot']} />
        </>
      ) : (
        <nav
          id="navbars"
          className={`${isOpen ? 'max-h-(--nav-max-height)' : 'max-h-0'} col-span-full overflow-hidden text-left text-xl transition-all md:text-base`}
        >
          <div
            className={`wrapper max-h-[calc(100vh-var(--nav-height))] overflow-scroll`}
          >
            {/* @ts-expect-error type number problem with database schema  */}
            <NavBar data={nav['menu-items-top']} />
            {/* @ts-expect-error type number problem with database schema  */}
            <NavBar data={nav['menu-items-bot']} className="pb-6" />
          </div>
        </nav>
      )}
    </nav>
  )
}

export default Navigation
