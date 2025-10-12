import Modal from '../../_ui/Modal'
import CalendarPopup from '../../_ui/CalendarPopUp'

export default function Page() {
  return (
    <Modal>
      <CalendarPopup hasClose={true} />
    </Modal>
  )
}
