import { Exhibition } from '@/payload-types'
import ExhibitionItem from '../ExhibitionItem'

const ExhibitionsList = (props: {
  exhibitions: Partial<Exhibition>[]
  slug: string
  children?: React.ReactNode
}) => {
  const { children, exhibitions, slug } = props
  return (
    <div className="exhibitions col-span-full grid grid-cols-subgrid">
      {children && children}
      <ul className="col-span-full mb-6 grid w-full grid-cols-subgrid py-2">
        {exhibitions.map((e) => (
          <ExhibitionItem exhibition={e} key={e.id} slug={slug} />
        ))}
      </ul>
    </div>
  )
}

export default ExhibitionsList
