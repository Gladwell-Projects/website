import { Fragment } from 'react'

const Modal = (props: { children: React.ReactNode; isActive: boolean }) => {
  const { isActive, children } = props

  return (
    <>
      {isActive && (
        <div className="modal-wrapper grid h-dvh grid-cols-12 gap-3 p-2 lg:p-6">
          {children}
        </div>
      )}
    </>
  )
}

export default Modal

export const ModalItem = (props: {
  children: React.ReactNode
  className: string
}) => {
  const { children, className } = props
  return <div className={`modal--item ${className}`}>{children}</div>
}
