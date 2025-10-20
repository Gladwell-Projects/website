import React from 'react'
import { ThemeProvider } from './_contexts/ThemeContext'
import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'

import './main.css'
import CursorSpotlight from './_ui/CursorSpotlight'

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '700'],
  variable: '--theme-mono',
})

const sans = localFont({
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
  fallback: ['arial', 'helvetica', 'sans-serif'],
})

export default function RootLayout(props: {
  children: React.ReactNode
  events: React.ReactNode
  newsletter: React.ReactNode
}) {
  const { children, events, newsletter } = props

  return (
    <ThemeProvider className={`${sans.variable} ${mono.variable}`}>
      <body className={`flex min-h-dvh flex-col flex-nowrap`}>
        {children}
        {events}
        {newsletter}
        <CursorSpotlight />
      </body>
    </ThemeProvider>
  )
}
