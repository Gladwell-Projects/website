import { Media } from '@/payload-types'
import { Caption } from '../Image'
import Image from 'next/image'

const TwoUp = (props: {
  leftImage: string | Media
  rightImage: string | Media
  showCaption: boolean
}) => {
  const { leftImage, rightImage, showCaption } = props

  if (typeof leftImage !== 'object' || typeof rightImage !== 'object') {
    return null
  }

  return (
    <div className="col-span-full grid grid-cols-subgrid justify-items-stretch">
      <TwoUpImage image={leftImage} showCaption={showCaption} />
      <TwoUpImage image={rightImage} showCaption={showCaption} />
    </div>
  )
}

export default TwoUp

const TwoUpImage = (props: { image: Media | number; showCaption: boolean }) => {
  const { image, showCaption } = props

  if (typeof image !== 'object') {
    return null
  }

  const { alt, url, width, height, caption } = image
  return (
    <div className="col-span-full flex md:col-span-6">
      <figure className="flex grow flex-col">
        <Image
          alt={alt}
          width={width}
          height={height}
          src={url}
          className="mb-2 grow object-contain"
        />
        {showCaption && (
          <Caption className="min-h-8 w-full place-self-end" caption={caption} />
        )}
      </figure>
    </div>
  )
}
