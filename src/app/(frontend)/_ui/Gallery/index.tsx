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

  return (
    <>
      <h4 className="col-span-full">{header}</h4>
      <div
        id={`gallery-${blockId}`}
        className="col-span-full -m-2 grid grid-cols-subgrid gap-y-4 bg-[color-mix(in_oklab,_white_0,var(--theme-bg))] p-2 pt-4 pb-8"
      >
        <div className="col-span-full grid grid-cols-subgrid place-items-end">
          <div className="col-span-full text-right">
            <button
              onClick={gridView}
              className={`relative mx-2 cursor-pointer border-2 border-(--theme-bg) bg-(--theme-bg) ${view === 'Grid' && 'outline-4 outline-(--theme-highlight)'}`}
            >
              <span className="relativem block h-3 w-3 border-2 border-(--theme-text)">
                <span className="absolute top-[50%] left-[50%] h-3 w-px -translate-[50%] bg-(--theme-text)">
                  {' '}
                </span>
                <span className="absolute top-[50%] left-[50%] h-px w-3 -translate-[50%] bg-(--theme-text)">
                  {' '}
                </span>
              </span>
              {/* grid */}
            </button>
            <button
              onClick={slideView}
              className={`row-start-1 cursor-pointer border-2 border-(--theme-bg) ${view === 'Slides' && 'outline-4 outline-(--theme-highlight)'}`}
            >
              <span className="relative block h-3 w-3 border-2 border-(--theme-text)"></span>
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
          />
        )}
        {view == 'Grid' && (
          <GalleryGrid
            items={galleryItems}
            setCurrentImg={setCurrentImg}
            setView={setView}
            blockId={blockId}
          />
        )}
      </div>
    </>
  )
}

export default Gallery
