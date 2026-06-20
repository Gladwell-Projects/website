import { getMainMenu } from './index'

export const currentThemeFromNav = async (fromSlug: string) => {
  const nav = await getMainMenu()
  const menuItems = [...nav['menu-items-top'], ...nav['menu-items-bot']]

  const slug = fromSlug.startsWith('/') ? fromSlug : `/${fromSlug}`

  const foundItem = menuItems.find((item) => {
    const referenceValue = item.link?.reference?.value
    const referenceSlug =
      referenceValue && typeof referenceValue === 'object' ? referenceValue.slug : undefined
    return slug === (item.link?.url || referenceSlug)
  })

  if (!foundItem) {
    return 'default'
  }

  // Match NavBar: theme follows the Direct Link `type`, never a stale stored
  // value. Reference links take the linked document's theme (or 'default' when
  // the reference is missing/invalid or the document has no theme); custom URL
  // and document links use the menu item's own theme.
  if (foundItem.link?.type === 'reference') {
    const value = foundItem.link.reference?.value
    if (value && typeof value === 'object' && 'theme' in value && value.theme) {
      return value.theme
    }
    return 'default'
  }

  return ('theme' in foundItem && foundItem.theme) || 'default'
}
