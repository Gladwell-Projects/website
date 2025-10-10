import React from 'react'
import { TextFieldServerComponent } from 'payload'
import Image from 'next/image'

const ImagePreview: TextFieldServerComponent = async ({ data, payload }) => {
  if (data.id) {
    const media = await payload.findByID({
      collection: 'media',
      id: data.id,
      disableErrors: true,
    })

    if (media) {
      return (
        <div>
          <p>Preview:</p>
          <p>
            <Image
              src={media.url!}
              alt={media.alt}
              width={media.width}
              height={media.height}
              style={{ margin: 'auto', objectFit: 'contain' }}
            />
          </p>
        </div>
      )
    }
  }
  return <p></p>
}

export default ImagePreview
