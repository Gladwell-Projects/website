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
    <nav className={`${navTemplate} ${!isVisible && '-top-full'} page-nav`}>
      <Logo />
      {/* @ts-expect-error type number problem with database schema  */}
      <NavBar data={nav['menu-items-top']} />
      {/* @ts-expect-error type number problem with database schema  */}
      <NavBar data={nav['menu-items-bot']} />
    </nav>
  )
}

export default Navigation
