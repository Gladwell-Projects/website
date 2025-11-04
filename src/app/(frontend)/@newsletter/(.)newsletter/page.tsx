export const dynamic = 'force-dynamic'
import Modal from '../../_ui/Modal'
import Newsletter from '../../_ui/Newsletter'

export default function Page(): React.ReactNode {
  return (
    <Modal>
      <div className="col-span-full flex min-h-full w-full flex-col place-self-stretch">
        <div className="grow basis-0"></div>
        <Newsletter />
        <div className="grow basis-0 lg:grow-2"></div>
      </div>
    </Modal>
  )
}
