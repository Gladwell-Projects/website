import { Media } from '@/payload-types'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import Image from 'next/image'
import { GladwellRichtext as RichText } from '@/components/frontend/lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const CMSImage = (props: {
  image: string | Media
  showCaption: boolean
  size?: 'medium' | 'large' | 'small'
  className?: string
  captionClasses?: string
  children?: React.ReactNode
}) => {
  const { image, showCaption, size, className, captionClasses, children } = props

  if (typeof image !== 'object') {
    return null
  }

  const { alt, url, width, height, caption } = image

  const classes =
    size === 'large'
      ? 'col-span-full'
      : size === 'medium'
        ? 'md:col-span-9 col-span-full'
        : size === 'small'
          ? 'col-span-full md:col-span-6 '
          : ''

  return (
    <figure
      data-size={size}
      className={`col-span-full grid grid-cols-subgrid [&+figure]:mt-0`}
    >
      <Image
        className={`${classes} ${className}`}
        alt={alt}
        src={url}
        width={width}
        height={height}
      />
      {children}
      {showCaption && hasText(caption) && (
        <Caption className={captionClasses} caption={caption} imgSize={size} />
      )}
    </figure>
  )
}

export const Caption = (props: {
  caption: SerializedEditorState
  imgSize?: string
  className?: string
}) => {
  const { caption, imgSize, className } = props
  return (
    <figcaption
      data-size={imgSize}
      className={`${className ? className : `col-span-full mt-2.5 md:col-span-3 md:-col-end-1 ${imgSize === 'large' ? 'md:mt-0' : ''}`} relative font-mono text-xs [&_p]:m-0`}
    >
      <div className={`${imgSize === 'large' && 'md:absolute md:top-2.5 md:left-0'}`}>
        <RichText data={caption} />
      </div>
    </figcaption>
  )
}
