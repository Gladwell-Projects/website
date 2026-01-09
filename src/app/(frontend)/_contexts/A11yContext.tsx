'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const A11yContext = createContext(undefined)

export const A11yProvider = ({ children }: { children: React.ReactNode }) => {
  const [a11y, setA11y] = useState<string>()
  const [theme, setTheme] = useContext(ThemeContext)

  useEffect(() => {
    const a11yData = localStorage.getItem('gladwell-a11y')
    if (a11yData) {
      setA11y(a11yData ? a11yData : '')
    }
    return
  }, [])

  useEffect(() => {
    if (a11y) {
      setTheme({ ...theme, current: a11y })
      console.log('a11y is active and set to', a11y)
    }
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a11y])

  return <A11yContext.Provider value={[a11y, setA11y]}>{children}</A11yContext.Provider>
}

export default A11yContext
