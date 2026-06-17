import type { Media } from '@/payload-types'

/**
 * `next/image` throws during render — and during static prerender, which fails
 * the whole build — when `src`, `width`, or `height` are missing.
 *
 * An upload relationship is not safe to render just because the field is set:
 * it can resolve to a bare id (a `string`/`number`) when the referenced media
 * was deleted, or to a `Media` doc whose `url`/`width`/`height` are `null`
 * (`payload-types` types all three as optional). Use this guard before passing
 * a media value to `<Image>`; inside the `true` branch the value is narrowed to
 * a `Media` with a usable url and dimensions.
 */
export const isRenderableImage = (
  image: Media | string | number | null | undefined,
): image is Media & { url: string; width: number; height: number } =>
  typeof image === 'object' &&
  image !== null &&
  typeof image.url === 'string' &&
  image.url.length > 0 &&
  typeof image.width === 'number' &&
  typeof image.height === 'number'
