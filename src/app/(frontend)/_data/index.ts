import { CollectionSlug, getPayload, Sort, Where } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

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
import toTitleCase from '@/utilities/toTitleCase'

export const payloadConfig = await config

// Tag shared by every cached global so a single `revalidateTag(GLOBALS_TAG)`
// (see src/globals/MainNavigation.ts) flushes them when the CMS changes.
export const GLOBALS_TAG = 'globals'

// Single Payload client per render. `cache` dedupes the promise within one
// request so every fetcher below shares one client instead of constructing
// (and re-binding to D1) on each call.
export const getPayloadClient = cache(async () => getPayload({ config }))

// ---------------------------------------------------------------------------
// Globals — fetched once per render (`cache`) and once per build (`unstable_cache`).
// Previously each of Header, Footer, generateMeta, fetchTopLevelTitle and
// currentThemeFromNav issued its own findGlobal; these getters collapse all of
// that into one D1 read per global.
// ---------------------------------------------------------------------------

export const getMainMenu = cache(
  unstable_cache(
    async (): Promise<MainMenu> =>
      (await getPayloadClient()).findGlobal({ slug: 'main-menu', depth: 2 }),
    ['global', 'main-menu'],
    { tags: [GLOBALS_TAG] }
  )
)

export const getBranding = cache(
  unstable_cache(
    async (): Promise<Branding> =>
      (await getPayloadClient()).findGlobal({ slug: 'branding', depth: 2 }),
    ['global', 'branding'],
    { tags: [GLOBALS_TAG] }
  )
)

export const getFooter = cache(
  unstable_cache(
    async (): Promise<Footer> =>
      (await getPayloadClient()).findGlobal({ slug: 'footer', depth: 1 }),
    ['global', 'footer'],
    { tags: [GLOBALS_TAG] }
  )
)

export const fetchGlobals = async (): Promise<{
  footer: Footer
  mainMenu: MainMenu
  // topBar: TopBar
  branding: Branding
}> => {
  const [footer, mainMenu, branding] = await Promise.all([
    getFooter(),
    getMainMenu(),
    getBranding(),
  ])
  return {
    footer,
    mainMenu,
    branding,
  }
}

export const fetchMainMenuArray = async () => {
  const menu = await getMainMenu()
  const top = menu['menu-items-top']
  const bottom = menu['menu-items-bot']

  return [...top, ...bottom]
}

// TODO: In the future, we should refactor to use stub pages for top-level navigation pages.
// titles will then take the page's title

export const fetchTopLevelTitle = async (slug: string) => {
  const menu = await fetchMainMenuArray()

  const item = menu.filter((item) => item.link.url && item.link.url === slug)[0]

  if (!slug) return null

  if (!item) {
    const page = await fetchPage(slug)
    if (!page) return toTitleCase(slug.split(/\/|\-/).join(' '))
    return page.title
  }

  return item.label
}

// ---------------------------------------------------------------------------
// Collections & documents.
//
// Each fetcher reads draftMode itself and owns its caching: the published
// branch runs through `unstable_cache` with a unique, collection-prefixed key
// (so e.g. event docs never collide with press docs); the draft branch reads
// live (dynamic APIs must not run inside an unstable_cache callback). Variable
// params are passed *as arguments* to the cached function so they become part
// of the cache key automatically.
// ---------------------------------------------------------------------------

export const fetchPress = async () => {
  const { isEnabled: draft } = await draftMode()

  const run = async (draft: boolean) => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'press',
      limit: 999999,
      pagination: false,
      sort: '-date',
      where: {
        and: [
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
    return data.docs
  }

  return draft ? run(true) : unstable_cache(() => run(false), ['press', 'list'])()
}

export const fetchPressItem = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()

  const run = async (slug: string, draft: boolean) => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'press',
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

    const page = data.docs.find(({ slug }: Press) => {
      if (!slug) {
        return false
      }

      return true
    })

    return page ?? null
  }

  return draft ? run(slug, true) : unstable_cache((s: string) => run(s, false), ['press', 'doc'])(slug)
}

export const fetchPage = async (incomingSlugSegments: string): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()
  const slug = incomingSlugSegments

  const run = async (slug: string, draft: boolean): Promise<null | Page> => {
    const payload = await getPayloadClient()
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

    return page ?? null
  }

  return draft ? run(slug, true) : unstable_cache((s: string) => run(s, false), ['pages', 'doc'])(slug)
}

export const fetchPages = async (): Promise<Partial<Page>[]> => {
  const run = async (): Promise<Partial<Page>[]> => {
    const payload = await getPayloadClient()
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

  return unstable_cache(run, ['pages', 'list'])()
}
export const fetchViewingRooms = async (): Promise<Partial<ViewingRoom>[]> => {
  const run = async (): Promise<Partial<ViewingRoom>[]> => {
    const payload = await getPayloadClient()
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

  return unstable_cache(run, ['viewing-rooms', 'list'])()
}

export const fetchViewingRoom = async (
  incomingSlugSegments: string
): Promise<null | ViewingRoom> => {
  const { isEnabled: draft } = await draftMode()
  const slug = incomingSlugSegments

  const run = async (slug: string, draft: boolean): Promise<null | ViewingRoom> => {
    const payload = await getPayloadClient()
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

    return page ?? null
  }

  return draft
    ? run(slug, true)
    : unstable_cache((s: string) => run(s, false), ['viewing-rooms', 'doc'])(slug)
}

export const fetchCollection = async (
  collection: CollectionSlug,
  sort?: Sort
): Promise<Partial<Artist | Exhibition | Event | Press | null>[]> => {
  const run = async (
    collection: CollectionSlug,
    sort?: Sort
  ): Promise<Partial<Artist | Exhibition | Event | Press | null>[]> => {
    const payload = await getPayloadClient()
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

  return unstable_cache(run, ['collection', 'list'])(collection, sort)
}

export const fetchEvent = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()

  const run = async (slug: string, draft: boolean) => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'events',
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

    const page = data.docs.find(({ slug }: Event) => {
      if (!slug) {
        return false
      }

      return true
    })

    return page ?? null
  }

  return draft ? run(slug, true) : unstable_cache((s: string) => run(s, false), ['events', 'doc'])(slug)
}

export const fetchEventsByMonth = async (
  where?: Where
): Promise<Partial<Event | null>[]> => {
  const run = async (where?: Where): Promise<Partial<Event | null>[]> => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'events',
      depth: 2,
      limit: 1000,
      sort: '-startDate',
      where,
    })

    return data.docs
  }

  return unstable_cache(run, ['events', 'by-month'])(where)
}

export const fetchExhibitions = async (sort: string): Promise<Partial<Exhibition>[]> => {
  const { isEnabled: draft } = await draftMode()

  const run = async (sort: string, draft: boolean): Promise<Partial<Exhibition>[]> => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'exhibitions',
      depth: 2,
      draft,
      sort,
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            type: {
              equals: 'exhibition',
            },
          },
        ],
      },
    })

    return data.docs
  }

  return draft
    ? run(sort, true)
    : unstable_cache((s: string) => run(s, false), ['exhibitions', 'list'])(sort)
}

export const fetchFairs = async (sort: string): Promise<Partial<Exhibition>[]> => {
  const { isEnabled: draft } = await draftMode()

  const run = async (sort: string, draft: boolean): Promise<Partial<Exhibition>[]> => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'exhibitions',
      depth: 2,
      draft,
      sort,
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            type: {
              equals: 'fair',
            },
          },
        ],
      },
    })

    return data.docs
  }

  return draft
    ? run(sort, true)
    : unstable_cache((s: string) => run(s, false), ['exhibitions', 'fairs'])(sort)
}

export const fetchExhibition = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()

  const run = async (slug: string, draft: boolean) => {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'exhibitions',
      depth: 3,
      draft,
      limit: 1,
      joins: {
        'related.relatedPress': {
          limit: 0,
        },
      },
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

  return draft
    ? run(slug, true)
    : unstable_cache((s: string) => run(s, false), ['exhibitions', 'doc'])(slug)
}

export const fetchFair = (slug: string) => fetchExhibition(slug)

export const fetchMedia = async (id: string | number) => {
  const run = async (id: string | number) => {
    const payload = await getPayloadClient()
    return payload.findByID({
      collection: 'media',
      id,
    })
  }

  return unstable_cache(run, ['media', 'doc'])(id)
}

export const fetchArtists = async (sort: string): Promise<Partial<Artist>[]> => {
  const { isEnabled: draft } = await draftMode()

  const run = async (sort: string, draft: boolean): Promise<Partial<Artist>[]> => {
    const payload = await getPayloadClient()
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

  return draft
    ? run(sort, true)
    : unstable_cache((s: string) => run(s, false), ['artists', 'list'])(sort)
}

export const fetchArtist = async (slug: string): Promise<Partial<Artist>> => {
  const { isEnabled: draft } = await draftMode()

  const run = async (slug: string, draft: boolean): Promise<Partial<Artist>> => {
    const payload = await getPayloadClient()
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

  return draft
    ? run(slug, true)
    : unstable_cache((s: string) => run(s, false), ['artists', 'doc'])(slug)
}

export const fetchDocument = async (
  collection: CollectionSlug,
  slug: string
): Promise<Partial<Artist | Exhibition | Event | Press | null>> => {
  const { isEnabled: draft } = await draftMode()

  const run = async (
    collection: CollectionSlug,
    slug: string,
    draft: boolean
  ): Promise<Partial<Artist | Exhibition | Event | Press | null>> => {
    const payload = await getPayloadClient()
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

  return draft
    ? run(collection, slug, true)
    : unstable_cache((c: CollectionSlug, s: string) => run(c, s, false), ['document', 'doc'])(
        collection,
        slug
      )
}
