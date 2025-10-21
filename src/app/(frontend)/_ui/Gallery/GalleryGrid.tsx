'use client'

import { Media } from '@/payload-types'
import Image from 'next/image'
import { Caption } from '../Image'
import { useRouter } from 'next/navigation'

const GalleryGrid = (props: {
  items: (string | Media)[]
  setCurrentImg: React.Dispatch<null | number>
  setView: React.Dispatch<'Grid' | 'Slides'>
  blockId: string
}) => {
  const { items, setCurrentImg, setView, blockId } = props
  const router = useRouter()

  const openItem = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget } = e

    const index = Number(currentTarget.getAttribute('data-index'))

    setCurrentImg(index)
    setView('Slides')
    router.push(`#gallery-${blockId}`)
  }

  return (
    <div className="col-span-full grid auto-rows-fr grid-cols-subgrid gap-3">
      {items.map((item, i) => {
        if (typeof item !== 'object') {
          return null
        }
        const { id, alt, url, width, height, caption } = item
        return (
          <div
            onClick={openItem}
            key={id}
            data-index={i}
            className="col-span-6 grid cursor-pointer grid-cols-1 grid-rows-[1fr_auto] gap-2 sm:col-span-4 lg:col-span-3 2xl:col-span-2"
          >
            <Image
              alt={alt}
              src={url}
              width={width}
              height={height}
              className="place-self-center"
              sizes="(max-width: 384px) 100vw, (max-width:512px) 40vw, (max-width:672px) 30vw, 55vw"
            />
            <Caption className="col-start-1 row-start-auto" caption={caption} />
          </div>
        )
      })}
    </div>
  )
}

export default GalleryGrid
