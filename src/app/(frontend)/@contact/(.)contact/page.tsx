export const dynamic = 'force-dynamic'
import ContactForm from '../../(pages)/contact/ContactForm'
import Modal, { ModalItem } from '../../_ui/Modal'

export default function Page(): React.ReactNode {
  return (
    <Modal>
      <ModalItem className="col-span-full row-start-2 mt-2 mb-4 lg:col-span-6 lg:col-start-4 lg:-mt-6">
        <h1>Contact Us</h1>
        <ContactForm />
      </ModalItem>
      <div className="col-span-full"></div>
    </Modal>
  )
}
