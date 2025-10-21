'use client'

import { Media } from '@/payload-types'
import { Caption } from '../Image'
import Image from 'next/image'

const GallerySlider = (props: {
  items: (string | Media)[]
  currentImg: number
  setCurrentImg: React.Dispatch<null | number>
  blockId: string
}) => {
  const { items, currentImg, setCurrentImg } = props

  if (!items) {
    return null
  }

  const next = () => {
    if (currentImg === items.length - 1) {
      setCurrentImg(0)
    } else {
      setCurrentImg(currentImg + 1)
    }
  }

  const previous = () => {
    if (currentImg === 0) {
      setCurrentImg(items.length - 1)
    } else {
      setCurrentImg(currentImg - 1)
    }
  }

  if (typeof items[currentImg] !== 'object') {
    return null
  }

  const { alt, url, width, height, caption } = items[currentImg]

  return (
    <div className="col-span-full grid grid-cols-subgrid overflow-visible [&_button]:col-span-1 [&_button]:h-full [&_button]:cursor-pointer [&_button]:place-self-center-safe [&_button]:px-1 [&_button]:text-lg [&_button]:md:text-2xl">
      <button onClick={previous} className="-ml-2">
        &larr;
      </button>
      <div className="col-span-10 grid w-full grid-cols-subgrid">
        <figure className="col-span-full grid grid-cols-subgrid">
          <Image
            className="col-span-full m-auto block h-[75vh] w-full object-contain md:col-span-8 md:h-[65vh]"
            alt={alt}
            width={width}
            height={height}
            src={url}
          />
          <Caption
            className="col-span-full mt-2 mb-0 block w-auto md:col-span-2 md:-col-end-1 md:mt-0 [&_p]:last:mb-0"
            caption={caption}
          />
        </figure>
      </div>
      <button onClick={next} className="-mr-2">
        &rarr;
      </button>
    </div>
  )
}

export default GallerySlider
