'use client'
import { useRouter } from 'next/navigation'

const Modal = (props: { children: React.ReactNode }) => {
  const { children } = props

  const router = useRouter()

  return (
    <div className="modal-wrapper h-vh inset-0 grid grid-cols-12 gap-x-3 gap-y-4 overflow-y-scroll p-2 pb-6 lg:grid-rows-1 lg:p-6">
      <div className="modalWrapper relative col-span-full grid h-max min-h-full grid-cols-subgrid grid-rows-[--spacing(8)_repeat(auto-fit,minmax(0,1fr))] place-items-center overflow-visible">
        <button
          onClick={() => router.back()}
          className="modal--item sticky top-2 right-0 z-99 col-span-4 col-start-5 row-start-1 block h-min w-full cursor-pointer p-1 text-xs lg:col-span-1 lg:col-start-12 lg:p-1 lg:text-sm"
        >
          Close
        </button>
        {children}

        <div className="col-span-full mt-8 hidden h-4 lg:block">{/* spacer */}</div>
      </div>
    </div>
  )
}

export default Modal

export const ModalItem = (props: { children?: React.ReactNode; className?: string }) => {
  const { children, className } = props
  return <div className={`modal--item ${className}`}>{children}</div>
}
