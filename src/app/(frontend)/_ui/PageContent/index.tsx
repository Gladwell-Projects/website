const Content: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="content col-span-full sm:col-span-8 lg:col-span-6">
      {children}
    </div>
  )
}

export default Content
