'use client'

import { useContext, useEffect } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'

const ThemeSwitch = (props: { templateTheme?: string }) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const { templateTheme } = props

  useEffect(() => {
    if (theme !== templateTheme) {
      setTheme(templateTheme)
    }
    // only want the effect to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default ThemeSwitch
