import React from 'react'
import ThemeSwitch from '../_ui/ThemeSwitch'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

export default function HomePage() {
  return (
    <>
      <ThemeSwitch templateTheme="default" />
    </>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/',
    meta: {
      title: 'Gladwell Projects — Do Nothing Without Intention',
    },
  }

  return generateMeta({ doc: page })
}
