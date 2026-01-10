'use client'

import { useContext, useLayoutEffect } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'
import A11yContext from '../../_contexts/A11yContext'

const ThemeSwitch = (props: { templateTheme?: string }) => {
  const [theme, setTheme] = useContext(ThemeContext)
  const [a11y, setA11y] = useContext(A11yContext)

  const { templateTheme } = props

  useLayoutEffect(() => {
    if (a11y.theme) {
      setTheme({
        default: templateTheme ? templateTheme : theme.default,
        current: a11y.theme,
      })
      return
    }
    setTheme({
      default: templateTheme ? templateTheme : theme.default,
      current: templateTheme ? templateTheme : theme.current,
    })
    return
    // only want the effect to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default ThemeSwitch
