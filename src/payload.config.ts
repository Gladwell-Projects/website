/**
 * @file payload.config.ts — Payload + Cloudflare D1 configuration.
 *
 * ┌─ CHANGING THE SCHEMA (read me when you forget) ──────────────────────────┐
 * │ Dev schema-PUSH is OFF by default (see the `push` option on the db        │
 * │ adapter below). On D1, push reconciles by REBUILDING tables, which fires  │
 * │ FK cascades + the SQLite quoted-identifier footgun and silently           │
 * │ deletes/mangles local data. So evolve the schema with MIGRATIONS:         │
 * │                                                                           │
 * │   1. edit a collection                                                    │
 * │   2. pnpm migrate:create        # generate a migration from the diff      │
 * │   3. REVIEW the generated file  # watch for the drizzle 12-step table     │
 * │                                 # rebuild (PRAGMA foreign_keys=OFF, which  │
 * │                                 # D1 IGNORES) — make it additive/safe      │
 * │   4. pnpm migrate:local         # apply it to the local D1 (data survives) │
 * │   5. commit the migration → deploy:database runs it on prod               │
 * │                                 # (guarded by scripts/migrate-guard.mjs)   │
 * │                                                                           │
 * │ Only for throwaway prototyping: `pnpm dev:push` (PAYLOAD_DB_PUSH=on).      │
 * │ Push NEVER runs in prod — prod schema changes go solely through migrate.  │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { resendAdapter } from '@payloadcms/email-resend'
import { withD1Retry } from './utilities/withD1Retry'

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
import AnalyticsDash from './globals/Analytics'
import { ContactSubmissions } from './collections/ContactForm'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const cloudflareRemoteBindings = process.env.NODE_ENV === 'production'
const cloudflare =
  process.argv.find((value) => value.match(/^(generate|migrate):?/)) ||
  !cloudflareRemoteBindings
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

// During `next build` the static export queries *remote* D1 over the beta
// remote-bindings HTTP proxy, which intermittently drops sockets and fails the
// whole export. Wrap the binding to retry transient socket errors on read
// queries while building; at Worker runtime D1 is a native binding, so leave it
// untouched (writes/batch keep their native objects).
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
const d1Binding = isBuild ? withD1Retry(cloudflare.env.D1) : cloudflare.env.D1

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
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
      ],
    },
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
  cors: {
    origins: [
      process.env.NEXT_PUBLIC_SERVER_URL,
      'https://docs.gladwellprojects.com',
      process.env.NEXTJS_ENV === 'development' ? 'http://localhost' : '',
    ],
  },
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL,
    'https://docs.gladwellprojects.com',
    process.env.NEXTJS_ENV === 'development' ? 'http://localhost' : '',
  ],
  editor: lexicalDefault,
  email: resendAdapter({
    defaultFromAddress: 'noreply@notifs.gladwellprojects.com',
    defaultFromName: 'Gladwell Projects',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  globals: [MainMenu, BrandSettings, Footer, AnalyticsDash],
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
    ContactSubmissions,
  ],
  blocks,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: d1Binding,
    idType: 'uuid',
    readReplicas: 'first-primary',
    // Dev schema-push is OFF by default. On D1 push reconciles the DB by
    // REBUILDING tables (DROP + recreate), which fires FK cascades (D1 ignores
    // PRAGMA foreign_keys=OFF) and the SQLite quoted-identifier footgun —
    // silently deleting/mangling local data on any non-additive change. The
    // safe, prod-matching workflow is migrations: edit a collection, run
    // `pnpm payload migrate:create`, review the generated SQL (watch for the
    // drizzle 12-step rebuild), then `pnpm migrate:local`. Opt into push only
    // for throwaway prototyping with `PAYLOAD_DB_PUSH=on pnpm dev` (or
    // `pnpm dev:push`). push never runs in prod regardless (prod uses migrate).
    ...(process.env.PAYLOAD_DB_PUSH === 'on' ? {} : { push: false }),
  }),
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
