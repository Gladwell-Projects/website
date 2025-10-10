import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string | undefined =>
  val
    ?.replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (operation === 'create' || value === '' || data?.slug === '') {
      const fallbackData = data?.[fallback]

      if (typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    if (typeof value === 'string') {
      return formatSlug(value)
    }

    return value
  }
