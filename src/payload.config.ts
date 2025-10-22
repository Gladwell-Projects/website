import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Exhibitions } from './collections/Exhibitions'
import { Press } from './collections/Press'
import { Pages } from './collections/Pages'
import { Artists } from './collections/Artists'
import { MainMenu } from './globals/MainNavigation'
import { Events } from './collections/Events'
import { Clients } from './collections/Clients'
import BrandSettings from './globals/Branding'
import { ViewingRooms } from './collections/ViewingRooms'
import plugins from './plugins'
import { Footer } from './globals/Footer'
import lexicalDefault from './collections/lexical/defaultFeatures'

import { blocks } from './blocks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const cloudflareRemoteBindings = process.env.NODE_ENV === 'production'
const cloudflare =
  process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
  !cloudflareRemoteBindings
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    timezones: {
      defaultTimezone: 'America/New_York',
    },
    autoLogin: false,
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {},
    meta: {
      titleSuffix: '— Gladwell Projects',
      description: 'Gladwell Projects Admin Panel',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg',
          url: 'assets/favicon.svg',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/components/payload/Logo',
        Icon: './components/payload/Icon',
      },
    },
  },
  email: resendAdapter({
    defaultFromAddress: 'noreply@notifs.gladwellprojects.com',
    defaultFromName: 'Gladwell Projects',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  globals: [MainMenu, BrandSettings, Footer],
  collections: [
    Media,
    Artists,
    Exhibitions,
    Press,
    Events,
    Pages,
    Users,
    ViewingRooms,
    Clients,
  ],
  blocks,
  editor: lexicalDefault,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1, idType: 'uuid' }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    ...plugins,
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        experimental: { remoteBindings: cloudflareRemoteBindings },
      } satisfies GetPlatformProxyOptions)
  )
}
