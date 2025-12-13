import { Metadata, Viewport } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import React from 'react'
import { fetchViewingRooms } from '../../_data'
import { currentThemeFromNav } from '@/app/(frontend)/_data/theme'
import ThemeSwitch from '../../_ui/ThemeSwitch'
import Headline from '../../_ui/Headline'
import SubGrid from '../../_ui/pageGrid'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import ViewingRoomTile from './components/Tile'
import { colors } from '@/fields/theme'

const ViewingRoomsPage: React.FC = async () => {
  const { isEnabled: draft } = await draftMode()
  const viewingRooms = draft
    ? await fetchViewingRooms()
    : await unstable_cache(fetchViewingRooms, ['viewingRooms'])()

  const slug = 'viewing-rooms'

  const pageTheme = await currentThemeFromNav(slug)

  if (viewingRooms.length < 1) {
    return (
      <SubGrid>
        <ThemeSwitch templateTheme={pageTheme} />
        <Headline title="Viewing Rooms" />
        <h6 className="col-span-full">There aren&rsquo;t any viewing rooms yet.</h6>
      </SubGrid>
    )
  }
  return (
    <SubGrid>
      <ThemeSwitch templateTheme={pageTheme} />
      <Headline title="Viewing Rooms" />
      <div className="col-span-full grid grid-cols-subgrid gap-x-3 gap-y-4">
        {viewingRooms.map((room) => {
          return <ViewingRoomTile key={room.id} room={room} />
        })}
      </div>
    </SubGrid>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/viewing-rooms',
    meta: {
      title: 'Viewing Rooms | Gladwell Projects',
      description: 'Gladwell Projects Viewing Rooms',
    },
  }

  return generateMeta({ doc: page })
}

export const generateViewport = async (): Promise<Viewport> => {
  const slug = 'viewing-rooms'
  const pageTheme = await currentThemeFromNav(slug)
  const themeColor = colors.find((a) => a.theme === pageTheme).code

  return {
    themeColor,
  }
}

export default ViewingRoomsPage
