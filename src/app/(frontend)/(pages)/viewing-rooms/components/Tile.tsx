import { ViewingRoom } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

const ViewingRoomTile = (props: { room: Partial<ViewingRoom> }) => {
  const { room } = props

  let url, alt, width, height

  if (room.cover && typeof room.cover === 'object') {
    ;({ url, alt, width, height } = room.cover)
  }

  return (
    <div
      key={room.id}
      className={`${room.theme ? `theme-${room.theme}` : ''} col-span-full grid grid-cols-subgrid gap-2 bg-(--theme-bg) p-2 text-(color:--theme-text)`}
    >
      {room.cover && (
        <Link
          href={`/viewing-rooms/${room.slug}`}
          className="col-span-4 text-(--theme-text) no-underline"
        >
          <Image
            src={url}
            alt={alt}
            width={width}
            height={height}
            className="aspect-4/3 w-full object-cover"
            sizes="(max-width: 448px) 100vw, 50vw"
          />
        </Link>
      )}
      <h3 className="col-span-8 w-full place-self-center text-left">
        <Link
          href={`/viewing-rooms/${room.slug}`}
          className="text-(--theme-text) no-underline"
        >
          {room.title}
        </Link>
      </h3>
    </div>
  )
}

export default ViewingRoomTile
