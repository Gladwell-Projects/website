const Headline: React.FC<{ children?: React.ReactNode; title?: string }> = ({
  title,
  children,
}) => {
  return (
    <div className="headline col-span-full py-4">
      {title && <h1>{title}</h1>}
      {children}
    </div>
  )
}
export default Headline
