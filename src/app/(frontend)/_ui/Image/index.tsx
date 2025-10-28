import { Media } from '@/payload-types'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import Image from 'next/image'
import { GladwellRichtext as RichText } from '@/components/frontend/lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const CMSImage = (props: {
  image: string | Media
  showCaption: boolean
  size?: 'medium' | 'large' | 'small' | 'half'
  className?: string
  captionClasses?: string
  children?: React.ReactNode
  blockSize?: 'full' | 'small' | 'x-small'
}) => {
  const { image, showCaption, size, className, captionClasses, children, blockSize } =
    props

  if (typeof image !== 'object') {
    return null
  }

  const { alt, url, width, height, caption } = image

  const classes = () => {
    switch (size) {
      case 'large':
        return 'col-span-full'
      case 'medium':
        return 'md:col-span-9 col-span-full'
      case 'small':
        return 'col-span-full md:col-span-6 '
      case 'half':
        return 'col-span-full'
      default:
        return null
    }
  }

  const sizes = () => {
    switch (size) {
      case 'large':
        return '100vw'
      case 'medium':
        return '(width >= 48rem) 100vw, 75vw'
      case 'small':
        return '(width >=48rem) 100vw, 50vw'
      case 'half':
        return '(width >=48rem) 100vw, 50vw'
      default:
        return '(width >=48rem) 100vw, 50vw'
    }
  }

  return (
    <figure
      data-size={size}
      className={`${size === 'half' ? 'col-span-full place-self-start md:col-span-6 md:col-start-7' : `col-span-full`} grid grid-cols-subgrid [&+figure]:mt-0`}
    >
      <Image
        className={`${classes()} w-auto place-self-center ${blockSize === 'full' ? 'col-span-full' : blockSize === 'small' ? 'md:col-span-4 md:col-start-2' : blockSize === 'x-small' ? (showCaption && hasText(caption) ? 'md:col-span-3 md:col-start-1' : 'md:col-span-3 md:col-start-3') : ''} ${className}`}
        alt={alt}
        src={url}
        width={width}
        height={height}
        sizes={sizes()}
      />
      {children}
      {showCaption && hasText(caption) && (
        <Caption
          className={captionClasses}
          caption={caption}
          imgSize={size}
          blockSize={blockSize}
        />
      )}
    </figure>
  )
}

export const Caption = (props: {
  caption: SerializedEditorState
  imgSize?: string
  className?: string
  blockSize?: string
}) => {
  const { caption, imgSize, className, blockSize } = props
  return (
    <figcaption
      data-size={imgSize}
      className={`${blockSize === 'small' ? `mt-2.5 md:col-span-4 md:col-start-2` : ''} ${className ? className : `col-span-full mt-2.5 md:col-span-3 md:-col-end-1 ${imgSize === 'large' ? 'md:mt-0' : ''}`} relative font-mono text-xs [&_p]:m-0`}
    >
      <div className={`${imgSize === 'large' && 'md:absolute md:top-2.5 md:left-0'}`}>
        <RichText data={caption} />
      </div>
    </figcaption>
  )
}
