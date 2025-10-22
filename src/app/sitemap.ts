import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import {
  fetchArtists,
  fetchExhibitions,
  fetchPages,
  fetchPress,
  fetchViewingRooms,
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

  return [
    ...pages.map(({ slug, updatedAt }) => ({
      url: `${url}/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    {
      url: `${url}/exhibitions`,
      lastModified: new Date(),
    },
    ...exhibitions.map(({ slug, updatedAt }) => ({
      url: `${url}/exhibitions/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    {
      url: `${url}/artists`,
      lastModified: new Date(),
    },
    ...artists.map(({ slug, updatedAt }) => ({
      url: `${url}/artists/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    {
      url: `${url}/press`,
      lastModified: new Date(),
    },
    ...press.map(({ slug, updatedAt }) => ({
      url: `${url}/press/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    {
      url: `${url}/viewing-rooms`,
      lastModified: new Date(),
    },
    ...viewingRooms.map(({ slug, updatedAt }) => ({
      url: `${url}/viewing-rooms/${slug}`,
      lastModified: new Date(updatedAt),
    })),
    {
      url: `${url}/events`,
      lastModified: new Date(),
    },
    {
      url: `${url}/newsletter`,
      lastModified: new Date(),
    },
  ]
}
