'use client'

import { useContext, useLayoutEffect } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'

const ThemeSwitch = (props: { templateTheme?: string }) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const { templateTheme } = props

  useLayoutEffect(() => {
    setTheme({
      default: templateTheme ? templateTheme : theme.default,
      current: templateTheme ? templateTheme : theme.current,
    })
    // only want the effect to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default ThemeSwitch
