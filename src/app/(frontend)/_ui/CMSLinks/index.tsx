import type {
  Page,
  Artist,
  Exhibition,
  Press,
  ViewingRoom,
  Event,
  Media,
} from '@/payload-types'
import Link from 'next/link'

export type LinkType = 'custom' | 'reference' | 'upload' | null
export type Reference = {
  relationTo: 'pages' | 'artists' | 'exhibitions' | 'press' | 'viewingRooms' | 'events'
  value: Page | Artist | Exhibition | Press | ViewingRoom | Event
}

export type CMSLinkType = {
  appearance?: 'default' | 'primary' | 'secondary' | 'text' | null
  // buttonProps?: ButtonProps
  children?: React.ReactNode
  className?: string
  customId?: null | string
  fullWidth?: boolean
  label?: null | string
  mobileFullWidth?: boolean
  newTab?: boolean | null
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  reference?: Reference | null
  type?: LinkType | null
  url?: string | null
  upload?: Media | null
  role?: string
  onNavigate?: () => void
}

type GenerateSlugType = {
  reference?: null | Reference
  type?: LinkType | null
  url?: null | string
  upload?: null | Media
}
const generateHref = (args: GenerateSlugType): string => {
  const { type, reference, url, upload } = args

  if ((type === 'custom' || type === undefined) && url) {
    return url
  }

  if (type === 'upload' && upload?.url && upload) {
    return upload.url
  }

  if (type === 'reference' && reference?.value && typeof reference.value !== 'string') {
    if (reference.relationTo === 'pages') {
      return `/${reference.value.slug}`
    }

    if (reference.relationTo === 'exhibitions') {
      return `/exhibitions/${reference.value.slug}`
    }

    if (reference.relationTo === 'viewingRooms') {
      return `/viewing-rooms/${reference.value.slug}`
    }

    if (reference.relationTo === 'artists') {
      return `/artists/${reference.value.slug}`
    }

    if (reference.relationTo === 'press') {
      return `/press/${reference.value.slug}`
    }

    if (reference.relationTo === 'events') {
      return `/events/${reference.value.slug}`
    }

    return `/${reference.relationTo}/${reference.value.slug}`
  }

  return ''
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance,
  // buttonProps: buttonPropsFromProps,
  children,
  className,
  customId,
  // fullWidth = false,
  label,
  // mobileFullWidth = false,
  newTab,
  onClick,
  onMouseEnter,
  onMouseLeave,
  reference,
  upload,
  url,
  role,
  onNavigate,
}) => {
  let href = generateHref({ type, reference, url, upload })

  if (!href) {
    return (
      <span
        className={className}
        id={customId ?? type}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label}
        {children}
      </span>
    )
  }

  if (!appearance) {
    const hrefIsLocal = ['tel:', 'mailto:', '/'].some((prefix) => href.startsWith(prefix))

    if (!hrefIsLocal && href !== '#') {
      try {
        const objectURL = new URL(href)
        if (objectURL.origin === process.env.NEXT_PUBLIC_SITE_URL) {
          href = objectURL.href.replace(process.env.NEXT_PUBLIC_SITE_URL, '')
        }
      } catch (e) {
        // Do not throw error if URL is invalid
        // This will prevent the page from building
        console.log(`Failed to format url: ${href}`, e)
      }
    }

    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (href.indexOf('/') === 0) {
      return (
        <Link
          href={href}
          {...newTabProps}
          className={className}
          id={customId ?? ''}
          onNavigate={onNavigate}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          prefetch={false}
          role={role}
        >
          {label && label}
          {children && children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        {...newTabProps}
        className={className}
        id={customId ?? ''}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={role}
      >
        {label && label}
        {children && children}
      </a>
    )
  }

  // const buttonProps: ButtonProps = {
  //   ...buttonPropsFromProps,
  //   appearance,
  //   fullWidth,
  //   href,
  //   label,
  //   mobileFullWidth,
  //   newTab,
  //   onClick,
  //   onMouseEnter,
  //   onMouseLeave,
  // }

  if (appearance === 'default') {
    // buttonProps.icon = 'arrow'
  }

  // return <Button {...buttonProps} className={className} el="link" id={customId ?? ''} />
}
