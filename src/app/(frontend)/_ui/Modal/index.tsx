'use client'
import { usePathname, useRouter } from 'next/navigation'

const Modal = (props: { children: React.ReactNode }) => {
  const { children } = props

  const router = useRouter()

  return (
    <>
      <div className="modal-wrapper h-vh inset-0 grid grid-cols-12 grid-rows-[--spacing(6)_1fr] gap-3 p-2 pb-6 lg:grid-rows-1 lg:p-6">
        <button
          onClick={() => router.back()}
          className="modal--item sticky top-2 right-0 z-99 col-span-4 col-start-5 row-start-1 block w-full cursor-pointer p-1 text-xs lg:col-span-1 lg:col-start-12 lg:p-1 lg:text-sm"
        >
          Close
        </button>
        {children}
      </div>
    </>
  )
}

export default Modal

export const ModalItem = (props: { children?: React.ReactNode; className?: string }) => {
  const { children, className } = props
  return <div className={`modal--item ${className}`}>{children}</div>
}
