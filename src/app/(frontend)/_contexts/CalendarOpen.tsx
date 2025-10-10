'use client'
import { createContext, useContext } from 'react'
import { useState } from 'react'

export const CalendarContext = createContext(null)

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [calOpen, setCalOpen] = useState(false)

  return (
    <CalendarContext.Provider value={[calOpen, setCalOpen]}>
      {children}
    </CalendarContext.Provider>
  )
}

// Custom hook to consume the theme
const useCal = () => {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
export default useCal
