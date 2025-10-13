const HamburgerIcon = (props: {
  isOpen: boolean
  onClick?: () => void
  className?: string
}) => {
  const { isOpen, onClick, className } = props

  return (
    <button
      onClick={onClick}
      className={`relative top-[-6px] h-[10px] w-4 [&_span]:absolute [&_span]:block [&_span]:h-[2px] [&_span]:w-4 [&_span]:bg-(--theme-text) ${className}`}
    >
      <span
        className={`top-0 transition-transform ${isOpen && 'translate-y-[0px] rotate-45 transition-transform'}`}
      ></span>
      <span
        className={`bottom-0 transition-transform ${isOpen && 'translate-y-[-8px] -rotate-45 transition-transform'}`}
      ></span>
    </button>
  )
}

export default HamburgerIcon
