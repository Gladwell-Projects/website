import { ViewingRoom } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { isRenderableImage } from '@/utilities/isRenderableImage'

const ViewingRoomTile = (props: { room: Partial<ViewingRoom> }) => {
  const { room } = props

  const cover = isRenderableImage(room.cover) ? room.cover : null

  return (
    <div
      key={room.id}
      className={`${room.theme ? `theme-${room.theme}` : ''} col-span-full grid grid-cols-subgrid gap-2 bg-(--theme-bg) p-2 text-(--theme-text)`}
    >
      {cover && (
        <Link
          href={`/viewing-rooms/${room.slug}`}
          className="col-span-4 text-(--theme-text) no-underline"
        >
          <Image
            src={cover.url}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            className="aspect-4/3 w-full object-cover"
            sizes="(width >=48rem) 50vw, 100vw"
          />
        </Link>
      )}
      <div className="col-span-8 w-full place-self-center text-left text-2xl font-bold">
        <Link
          href={`/viewing-rooms/${room.slug}`}
          className="text-(--theme-text) no-underline"
        >
          {room.title}
        </Link>
      </div>
    </div>
  )
}

export default ViewingRoomTile
