const Headline: React.FC<{
  children?: React.ReactNode
  title?: string
  className?: string
}> = ({ title, children, className }) => {
  return (
    <div className={`headline col-span-full grid grid-cols-subgrid py-4 ${className}`}>
      {title && <h1 className="col-span-full md:col-span-10">{title}</h1>}
      {children}
    </div>
  )
}
export default Headline
