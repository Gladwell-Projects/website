'use client'
import { Media } from '@/payload-types'
import GallerySlider from './GallerySlider'
import { useState } from 'react'
import GalleryGrid from './GalleryGrid'

const Gallery = (props: {
  galleryItems: (string | Media)[]
  header: string
  defaultState?: 'Grid' | 'Slides'
  blockId?: string
}) => {
  const { galleryItems, defaultState, header, blockId } = props
  const [view, setView] = useState<'Grid' | 'Slides'>(defaultState || 'Slides')
  const [currentImg, setCurrentImg] = useState<null | number>(0)

  const gridView = () => {
    setView('Grid')
  }
  const slideView = () => {
    setView('Slides')
  }

  const galleryId = blockId
    ? `gallery-${blockId}`
    : `gallery-${encodeURIComponent(header)}`

  return (
    <div id={galleryId} className="col-span-full grid grid-cols-subgrid">
      <h2 className="col-span-full text-xl">{header}</h2>
      <div className="col-span-full -m-2 grid grid-cols-subgrid gap-y-4 bg-[color-mix(in_oklab,white_0,var(--theme-bg))] p-2 pt-4 pb-8">
        <div className="col-span-full grid grid-cols-subgrid place-items-end">
          <div className="col-span-full flex gap-2 text-right">
            <button
              aria-label="switch gallery to grid view"
              onClick={gridView}
              className={`cursor-pointer border-2 border-(--theme-bg) bg-(--theme-bg) ${view === 'Grid' ? 'shadow-[0_0_0_4px_var(--theme-highlight)] [&>span>span]:border-(--theme-bg) [&>span>span]:bg-(--theme-text)' : '[&>span>span]:border-2'}`}
            >
              <span className="m-0 grid h-2.5 w-2.5 grid-cols-2 grid-rows-2 gap-[2px] overflow-hidden p-0">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
              {/* grid */}
            </button>
            <button
              aria-label="switch gallery to slides view"
              onClick={slideView}
              className={`row-start-1 cursor-pointer border-2 border-(--theme-bg) ${view === 'Slides' ? 'shadow-[0_0_0_4px_var(--theme-highlight)] [&_span]:bg-(--theme-text)' : '[&_span]:border-2'}`}
            >
              <span className="block h-2.5 w-2.5"></span>
              {/* slides */}
            </button>
          </div>
        </div>
        {view === 'Slides' && (
          <GallerySlider
            items={galleryItems}
            currentImg={currentImg}
            setCurrentImg={setCurrentImg}
            blockId={blockId}
            galleryId={galleryId}
          />
        )}
        {view == 'Grid' && (
          <GalleryGrid
            items={galleryItems}
            setCurrentImg={setCurrentImg}
            setView={setView}
            blockId={blockId}
            galleryId={galleryId}
          />
        )}
      </div>
    </div>
  )
}

export default Gallery
