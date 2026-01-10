'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const A11yContext = createContext(undefined)

export const A11yProvider = ({ children }: { children: React.ReactNode }) => {
  const [a11y, setA11y] = useState({ theme: null, text: null })
  const [theme, setTheme] = useContext(ThemeContext)

  useEffect(() => {
    try {
      const a11yData = localStorage.getItem('gladwell-a11y')
      const a11yJson = JSON.parse(a11yData)
      setA11y(a11yJson)
    } catch (error) {
      console.log(error)
      localStorage.removeItem('gladwell-a11y')
    }
    return
  }, [])

  useEffect(() => {
    if (a11y?.theme) {
      setTheme({ ...theme, current: a11y.theme })
    }
    if (a11y?.text === 'textLarge') {
      document.documentElement.style.setProperty('--font-size-base-px', '25px')
    } else {
      document.documentElement.style.removeProperty('--font-size-base-px')
    }

    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a11y])

  return <A11yContext.Provider value={[a11y, setA11y]}>{children}</A11yContext.Provider>
}

export default A11yContext
