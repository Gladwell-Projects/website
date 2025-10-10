import React from 'react'
import { DefaultServerCellComponentProps } from 'payload'
import Image from 'next/image'

const artworkCell = async ({
  cellData,
  payload,
}: DefaultServerCellComponentProps) => {
  const media = await payload.findByID({
    collection: 'media',
    id: cellData,
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '200px',
        height: '200px',
      }}
    >
      <Image
        src={media.url!}
        alt={media.alt}
        width={media.width}
        height={media.height}
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
export default artworkCell
