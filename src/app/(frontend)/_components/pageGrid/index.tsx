const SubGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="col-start-1 -col-end-1 grid grid-cols-subgrid">
      {children}
    </div>
  )
}
export default SubGrid
