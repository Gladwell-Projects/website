'use client'
// image-loader.ts
import { getClientSideURL, getServerSideURL } from '@/utilities/getURL'
import type { ImageLoaderProps } from 'next/image'

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  if (process.env.NODE_ENV === 'development') {
    // Serve the original image when using `next dev`
    return src
  }

  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality || 80}`)
  }
  const zone = 'gladwellprojects.com'
  const paramsString = params.join(',')

  let source = getServerSideURL()

  if (source === 'https://gladwellprojects.com') {
    source = ''
  }

  return `https://${zone}/cdn-cgi/image/${paramsString}/${source}/${normalizeSrc(src)}`
}
