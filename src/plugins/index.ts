import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Plugin } from 'payload'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Page, Exhibition, Artist, Event, Press } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page | Exhibition | Artist | Event | Press> = ({
  doc,
}) => {
  return doc?.title ? `${doc.title} | Gladwell Projects` : 'Gladwell Projects'
}

const generateURL: GenerateURL<Page | Exhibition | Artist | Event | Press> = ({
  doc,
}) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const plugins: Plugin[] = [
  payloadCloudPlugin(),
  seoPlugin({
    generateTitle,
    generateURL,
    collections: ['pages', 'exhibitions', 'press', 'events', 'artists'],
    uploadsCollection: 'media',
    generateDescription: ({ doc }) => doc.plainText,
    tabbedUI: false,
  }),
]

export default plugins
