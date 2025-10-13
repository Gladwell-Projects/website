import CalendarPopup from '../../_ui/CalendarPopUp'
import Headline from '../../_ui/Headline'
const EventsPage = () => {
  return (
    <div className="col-span-full grid w-full grid-cols-subgrid gap-3">
      <Headline title="Events" className="col-span-full row-start-1 w-full" />
      <CalendarPopup hasClose={false} />
    </div>
  )
}

export default EventsPage
