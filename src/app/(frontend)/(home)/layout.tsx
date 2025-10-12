import React from 'react'
import Header from '../_ui/Header'

const App = (props: { children: React.ReactNode }) => {
  const { children } = props

  return (
    <main className="grid min-h-dvh grid-cols-12 gap-3 p-2">
      <Header navTemplate="spread" />
      {children}
    </main>
  )
}

export default App
