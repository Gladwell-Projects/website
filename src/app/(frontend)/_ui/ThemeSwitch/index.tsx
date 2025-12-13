'use client'

import { useContext, useEffect } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'

const ThemeSwitch = (props: { templateTheme?: string }) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const { templateTheme } = props

  useEffect(() => {
    const a18y = localStorage.getItem('gladwell-a18y')
    if (a18y) {
      const a18yOptions = JSON.parse(a18y)

      setTheme(
        a18yOptions.dark ? 'dark' : a18yOptions.contrast ? 'contrast' : templateTheme
      )
    } else {
      setTheme(templateTheme)
    }
    // only want the effect to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default ThemeSwitch
