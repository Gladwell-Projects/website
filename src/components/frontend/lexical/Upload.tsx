import { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { hasText } from '@payloadcms/richtext-lexical/shared'

// Custom upload converter component that uses next/image
const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode
}> = ({ node }) => {
  if (node.relationTo === 'media') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, height, url, width, caption } = uploadDoc
    return (
      <>
        <figure>
          <Image alt={alt} height={height} src={url} width={width} />
          {hasText(caption) && (
            <figcaption>
              <RichText data={caption} />
            </figcaption>
          )}
        </figure>
      </>
    )
  }

  return null
}

export default CustomUploadComponent
