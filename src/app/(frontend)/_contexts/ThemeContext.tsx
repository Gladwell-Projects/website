'use client'
import { createContext, useContext } from 'react'
import { useState } from 'react'

export const ThemeContext = createContext(undefined)

export const ThemeProvider = ({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) => {
  const [theme, setTheme] = useState({ default: 'default', current: 'default' })

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={`theme-${theme.current} ${className}`}
      >
        {children}
      </html>
    </ThemeContext.Provider>
  )
}

export default ThemeContext

// Custom hook to consume the theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
