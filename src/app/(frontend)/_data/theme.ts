import { getPayload } from 'payload'
import config from '@/payload.config'

export const currentThemeFromNav = async (fromSlug: string) => {
  const payload = await getPayload({ config })
  const nav = await payload.findGlobal({
    slug: 'main-menu',
    depth: 2,
  })
  const menuItems = [...nav['menu-items-top'], ...nav['menu-items-bot']]

  const slug = fromSlug.startsWith('/') ? fromSlug : `/${fromSlug}`

  const foundItem = menuItems.find(
    // @ts-expect-error slug
    (item) => slug === (item.link?.url || item.link.reference?.value?.slug)
  )

  if (!foundItem) {
    return 'default'
  }

  if ('theme' in foundItem) {
    return foundItem.theme
  }

  return 'default'
}
