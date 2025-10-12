import { Exhibition } from '@/payload-types'
import ExhibitionItem from '../ExhibitionItem'

const ExhibitionsList = (props: {
  exhibitions: Partial<Exhibition>[]
  children?: React.ReactNode
}) => {
  const { children, exhibitions } = props
  return (
    <div className="exhibitions col-span-full grid grid-cols-subgrid">
      {children && children}
      <ul className="col-span-full grid w-full grid-cols-subgrid py-2">
        {exhibitions.map((e) => (
          <ExhibitionItem exhibition={e} key={e.id} />
        ))}
      </ul>
    </div>
  )
}

export default ExhibitionsList
