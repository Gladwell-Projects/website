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

/**
 * Reference rehydration ("ghosting").
 *
 * Payload's relationship population excludes trashed (soft-deleted) docs, so a
 * reference to a trashed — or hard-deleted — document comes back as a *bare id*
 * instead of a populated object, which crashes any render expecting an object.
 * For the tracked relationship fields below we re-resolve those bare ids with
 * `trash: true`: a recovered (trashed) doc is kept but flagged `outdated` so the
 * UI can render it as a dead/ghosted reference (title preserved, no link); a
 * bare id with no record left (hard-deleted pre-trash) is dropped entirely.
 */

/** A populated relationship doc, tagged `outdated` when its target is trashed. */
export type GhostedDoc = { outdated?: boolean; [key: string]: unknown }

/** Relationship fields that should be rehydrated, keyed by the owning collection. */
const RELATION_FIELDS: Partial<
  Record<CollectionSlug, { field: string; relationTo: CollectionSlug }[]>
> = {
  exhibitions: [{ field: 'featuredArtists', relationTo: 'artists' }],
  press: [
    { field: 'relatedArtists', relationTo: 'artists' },
    { field: 'relatedExhibitions', relationTo: 'exhibitions' },
  ],
  events: [{ field: 'relatedExhibitions', relationTo: 'exhibitions' }],
}

const isBareId = (value: unknown): value is string | number =>
  typeof value === 'string' || typeof value === 'number'

/**
 * Re-resolve bare-id references (trashed/deleted targets) across a set of docs,
 * batching a single `trash: true` lookup per related collection. Docs are mutated
 * in place: a recovered (trashed) target is flagged `outdated`; an unrecoverable
 * one (hard-deleted) is removed.
 *
 * @param collection - The collection the docs belong to (selects which fields to rehydrate).
 * @param docs - The documents to rehydrate (nullish entries are passed through untouched).
 * @returns The same array, with the tracked relationship fields rehydrated.
 */
const rehydrateRelations = async <T>(
  collection: CollectionSlug,
  docs: (T | null | undefined)[]
): Promise<(T | null | undefined)[]> => {
  const specs = RELATION_FIELDS[collection]
  const present = docs.filter((d): d is T => !!d)
  if (!specs || present.length === 0) return docs

  const payload = await getPayloadClient()
  const asRecord = (doc: T) => doc as Record<string, unknown>

  for (const { field, relationTo } of specs) {
    const bareIds = new Set<string | number>()
    for (const doc of present) {
      const value = asRecord(doc)[field]
      const entries = Array.isArray(value) ? value : value != null ? [value] : []
      for (const entry of entries) if (isBareId(entry)) bareIds.add(entry)
    }

    const recovered: Record<string, GhostedDoc> = {}
    if (bareIds.size > 0) {
      const found = await payload.find({
        collection: relationTo,
        depth: 0,
        pagination: false,
        limit: bareIds.size,
        overrideAccess: true,
        trash: true,
        where: { id: { in: [...bareIds] } },
      })
      for (const rec of found.docs) {
        const record = rec as unknown as Record<string, unknown>
        recovered[String(record.id)] = { ...record, outdated: true }
      }
    }

    const resolve = (entry: unknown): unknown =>
      isBareId(entry) ? (recovered[String(entry)] ?? null) : entry

    for (const doc of present) {
      const value = asRecord(doc)[field]
      if (Array.isArray(value)) {
        asRecord(doc)[field] = value.map(resolve).filter((e) => e != null)
      } else if (isBareId(value)) {
        asRecord(doc)[field] = resolve(value)
      }
    }
  }

  return docs
}

/**
 * Convenience wrapper around {@link rehydrateRelations} for single-document fetchers.
 *
 * @param collection - The collection the doc belongs to.
 * @param doc - The document to rehydrate (nullish is returned untouched).
 * @returns The same document with its tracked relationship fields rehydrated.
 */
const rehydrateDoc = async <T>(
  collection: CollectionSlug,
  doc: T | null | undefined
): Promise<T | null | undefined> => (await rehydrateRelations(collection, [doc]))[0]

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
    return rehydrateRelations('press', data.docs)
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

    return rehydrateDoc('press', page ?? null)
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

    return rehydrateDoc('events', page ?? null)
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

    return rehydrateRelations('events', data.docs)
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

    return rehydrateRelations('exhibitions', data.docs)
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

    return rehydrateRelations('exhibitions', data.docs)
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

    return rehydrateDoc('exhibitions', data.docs[0])
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
