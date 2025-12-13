import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import {
  fetchArtists,
  fetchExhibitions,
  fetchMainMenuArray,
  fetchPages,
  fetchPress,
  fetchViewingRooms,
  fetchFairs,
  fetchEventsByMonth,
} from './(frontend)/_data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //url
  const url: string = getServerSideURL()
  //artists
  const artists = await fetchArtists('lastName')
  //pages
  const pages = await fetchPages()
  //exhibitions
  const exhibitions = await fetchExhibitions('-startDate')
  //press
  const press = await fetchPress()
  //viewing-rooms
  const viewingRooms = await fetchViewingRooms()
  //fairs
  const fairs = await fetchFairs('-startDate')
  // events
  const events = await fetchEventsByMonth()

  const navigation = await fetchMainMenuArray()

  return [
    ...navigation.map(({ link }) => {
      const { type, reference, url } = link
      let sitemapUrl
      switch (type) {
        case 'upload':
          break
        case 'reference':
          if (typeof reference.value === 'string') {
            break
          }
          sitemapUrl = `${getServerSideURL()}/${reference?.value.slug}`
        case 'custom':
          if (url && url.indexOf('/') === 0) {
            sitemapUrl = `${getServerSideURL()}${url}`
          }
          if (url && url.includes(`${getServerSideURL()}`)) {
            sitemapUrl = `${url}`
          }
          break

        default:
          break
      }
      return {
        url: sitemapUrl || '',
        lastModified: new Date(),
      }
    }),
    ...pages.map(({ slug, updatedAt }) => ({
      url: `${url}/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    ...exhibitions.map(({ slug, updatedAt }) => ({
      url: `${url}/exhibitions/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    ...artists.map(({ slug, updatedAt }) => ({
      url: `${url}/artists/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    ...press.map(({ slug, updatedAt }) => ({
      url: `${url}/press/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    ...fairs.map(({ slug, updatedAt }) => ({
      url: `${url}/fairs/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    ...events.map(({ slug, updatedAt }) => ({
      url: `${url}/events/${slug}`,
      lastModified: new Date(updatedAt),
    })),
  ]
}
