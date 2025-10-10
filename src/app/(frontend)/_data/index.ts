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
} from '@/payload-types'

export const payloadConfig = await config

export const fetchGlobals = async (): Promise<{
  // footer: Footer
  mainMenu: MainMenu
  // topBar: TopBar
  branding: Branding
}> => {
  const payload = await getPayload({ config })

  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 1,
  })
  const branding = await payload.findGlobal({
    slug: 'branding',
    depth: 2,
  })
  // const footer = await payload.findGlobal({
  //   slug: 'footer',
  //   depth: 1,
  // })
  // const topBar = await payload.findGlobal({
  //   slug: 'topBar',
  //   depth: 1,
  // })
  return {
    // footer,
    mainMenu,
    branding,
    // topBar,
  }
}

export const fetchPage = async (
  incomingSlugSegments: string[]
): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slugSegments = incomingSlugSegments || ['home']
  const slug = slugSegments.at(-1)

  const data = await payload.find({
    collection: 'pages',
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

  const pagePath = `/${slugSegments.join('/')}`

  const page = data.docs.find(({ breadcrumbs }: Page) => {
    if (!breadcrumbs) {
      return false
    }
    const { url } = breadcrumbs[breadcrumbs.length - 1]
    return url === pagePath
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
    select: {
      breadcrumbs: true,
    },
    where: {
      and: [
        {
          slug: {
            not_equals: 'cloud',
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

export const fetchCollection = async (
  collection: CollectionSlug,
  sort?: Sort
): Promise<Partial<Artist | Exhibition | Event | Press | null>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection,
    depth: 1,
    limit: 300,
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

export const currentThemeFromNav = async (fromSlug: string) => {
  const nav = (await fetchGlobals()).mainMenu

  const menuItems = [...nav['menu-items-top'], ...nav['menu-items-bot']]

  const foundItem = menuItems.find(
    // @ts-expect-error slug
    (item) => fromSlug === (item.link?.url || item.link.reference?.value?.slug)
  )

  return foundItem ? foundItem.theme : 'default'
}
