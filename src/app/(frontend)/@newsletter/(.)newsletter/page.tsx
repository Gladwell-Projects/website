export const dynamic = 'force-dynamic'
import Modal from '../../_ui/Modal'
import Newsletter from '../../_ui/Newsletter'

export default function Page(): React.ReactNode {
  return (
    <Modal>
      <Newsletter />
      <div className="col-span-full mt-8 h-4"></div>
    </Modal>
  )
}
