import React from 'react'
import { ThemeProvider } from './_contexts/ThemeContext'
import { CalendarProvider } from './_contexts/CalendarOpen'
import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'

import './main.css'

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '700'],
  variable: '--theme-mono',
})

export const sans = localFont({
  src: [
    {
      path: '../../../public/fonts/ABCOracle-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ABCOracle-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/ABCOracle-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ABCOracle-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/ABCOracle-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/ABCOracle-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--theme-sans',
})

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <ThemeProvider className={`${sans.variable} ${mono.variable}`}>
      <body className={`min-h-dvh`}>
        <CalendarProvider>{children}</CalendarProvider>
      </body>
    </ThemeProvider>
  )
}
