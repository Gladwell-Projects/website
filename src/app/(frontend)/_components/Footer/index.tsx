import CalendarPopup from '../CalendarPopUp'

const Footer = (props: { children?: React.ReactNode }) => {
  const { children } = props
  return (
    <div>
      <CalendarPopup />
      {children && children}
    </div>
  )
}
export default Footer
