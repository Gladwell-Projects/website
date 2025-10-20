import { Metadata } from 'next'
import CalendarPopup from '../../_ui/CalendarPopUp'
import Headline from '../../_ui/Headline'
import { generateMeta } from '@/utilities/generateMeta'
const EventsPage = () => {
  return (
    <div className="col-span-full grid w-full grid-cols-subgrid gap-3">
      <Headline title="Events" className="col-span-full row-start-1 w-full" />
      <CalendarPopup hasClose={false} />
    </div>
  )
}

export default EventsPage

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/events',
    meta: {
      title: 'Events | Gladwell Projects',
      description: 'Events hosted by Gladwell Projects',
    },
  }

  return generateMeta({ doc: page })
}
