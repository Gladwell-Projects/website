const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="content col-span-full grid grid-cols-subgrid gap-y-4">{children}</div>
  )
}

export default Content
