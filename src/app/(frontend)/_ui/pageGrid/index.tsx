const SubGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="col-span-full grid grid-cols-subgrid">{children}</div>
}
export default SubGrid
