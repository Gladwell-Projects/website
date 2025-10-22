import { CollectionSlug, getPayload, Sort, Where } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'

import {
  Artist,
  Branding,
  Exhibition,
  MainMenu,
  Page,
  Press,
  Event,
  Footer,
  ViewingRoom,
} from '@/payload-types'

export const payloadConfig = await config

export const fetchGlobals = async (): Promise<{
  footer: Footer
  mainMenu: MainMenu
  // topBar: TopBar
  branding: Branding
}> => {
  const payload = await getPayload({ config })

  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 2,
  })
  const branding = await payload.findGlobal({
    slug: 'branding',
    depth: 2,
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })
  return {
    footer,
    mainMenu,
    branding,
  }
}

export const fetchPage = async (incomingSlugSegments: string): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slug = incomingSlugSegments

  const data = await payload.find({
    collection: 'pages',
    depth: 3,
    draft,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  const page = data.docs.find(({ slug }: Page) => {
    if (!slug) {
      return false
    }

    return true
  })

  if (page) {
    return page
  }

  return null
}

export const fetchPages = async (): Promise<Partial<Page>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 300,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return data.docs
}
export const fetchViewingRooms = async (): Promise<Partial<ViewingRoom>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'viewingRooms',
    depth: 2,
    limit: 300,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return data.docs
}

export const fetchViewingRoom = async (
  incomingSlugSegments: string
): Promise<null | ViewingRoom> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slug = incomingSlugSegments

  const data = await payload.find({
    collection: 'viewingRooms',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  const page = data.docs.find(({ slug }: ViewingRoom) => {
    if (!slug) {
      return false
    }

    return true
  })

  if (page) {
    return page
  }

  return null
}

export const fetchCollection = async (
  collection: CollectionSlug,
  sort?: Sort
): Promise<Partial<Artist | Exhibition | Event | Press | null>[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection,
    depth: 2,
    limit: 300,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort,
  })

  return data.docs
}

export const fetchEventsByMonth = async (
  where?: Where
): Promise<Partial<Event | null>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'events',
    depth: 2,
    limit: 1000,
    sort: '-startDate',
    where,
  })

  return data.docs
}

export const fetchExhibitions = async (sort: string): Promise<Partial<Exhibition>[]> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'exhibitions',
    depth: 2,
    draft,
    sort,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return data.docs
}
export const fetchExhibition = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'exhibitions',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchArtists = async (sort: string): Promise<Partial<Artist>[]> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'artists',
    depth: 2,
    draft,
    sort,
    where: {
      and: [
        {
          isRepresented: {
            equals: true,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return data.docs
}

export const fetchArtist = async (slug: string): Promise<Partial<Artist>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'artists',
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const fetchDocument = async (
  collection: CollectionSlug,
  slug: string
): Promise<Partial<Artist | Exhibition | Event | Press | null>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection,
    depth: 2,
    draft,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft
          ? []
          : [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]),
      ],
    },
  })

  return data.docs[0]
}

export const currentThemeFromNav = async (fromSlugs: string[]) => {
  const payload = await getPayload({ config })
  let foundItem
  const nav = await payload.findGlobal({
    slug: 'main-menu',
    depth: 2,
  })
  const menuItems = [...nav['menu-items-top'], ...nav['menu-items-bot']]

  const slug = fromSlugs[fromSlugs.length - 1]
  const collection = fromSlugs[0] as CollectionSlug

  foundItem = menuItems.find(
    // @ts-expect-error slug
    (item) => slug === (item.link?.url || item.link.reference?.value?.slug)
  )

  if (!foundItem) {
    foundItem = await payload.find({
      collection,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
  }

  if ('theme' in foundItem) {
    return foundItem.theme
  }

  return 'default'
}
