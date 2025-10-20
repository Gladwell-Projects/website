import { Artist, Exhibition, Page, ViewingRoom } from '@/payload-types'
import Gallery from '../Gallery'
import { GladwellRichtext as RichText } from '@/components/frontend/lexical'
import { CMSImage } from '../Image'
import TwoUp from '../TwoUp'

type Content =
  | Page['content']
  | Artist['content']
  | Exhibition['content']
  | ViewingRoom['content']
  | null

const PageBlocks = (props: { data: Content }) => {
  const { data: content } = props

  if (!Array.isArray(content)) {
    return null
  }

  return (
    <>
      {content &&
        content.map((block) => {
          switch (block.blockType) {
            case 'gallery':
              return (
                <Gallery
                  key={block.id}
                  galleryItems={block.images}
                  header={block.galleryHeader}
                  defaultState={block.defaultState || 'Slides'}
                  blockId={block.id}
                />
              )
            case 'headline':
              return (
                <RichText
                  key={block.id}
                  data={block.headline}
                  className={`${block.width === 'full' ? 'md:col-span-full' : ''} ${block.width === 'three-quarter' ? 'md:col-span-9' : ''}`}
                />
              )
            case 'text':
              return <RichText key={block.id} data={block.text} />
            case 'lgImage':
              return (
                <CMSImage
                  key={block.id}
                  image={block.lgImage}
                  showCaption={block.showCaption}
                  size="large"
                />
              )
            case 'mdImage':
              return (
                <CMSImage
                  key={block.id}
                  image={block.mdImage}
                  showCaption={block.showCaption}
                  size="medium"
                />
              )
            case 'smImage':
              return (
                <CMSImage
                  key={block.id}
                  image={block.smImage}
                  showCaption={block.showCaption}
                  size="small"
                />
              )
            case 'twoImage':
              return (
                <TwoUp
                  key={block.id}
                  leftImage={block.firstImage}
                  rightImage={block.secondImage}
                  showCaption={block.showCaption}
                />
              )
            default:
              return null
          }
        })}
    </>
  )
}

export default PageBlocks
