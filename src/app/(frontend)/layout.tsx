import React from 'react'
import { ThemeProvider } from './_contexts/ThemeContext'
import { CalendarProvider } from './_contexts/CalendarOpen'

import './main.css'

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ThemeProvider>
      <body className="min-h-dvh">
        <CalendarProvider>{children}</CalendarProvider>
      </body>
    </ThemeProvider>
  )
}
