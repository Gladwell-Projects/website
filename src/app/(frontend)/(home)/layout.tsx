import React from 'react'
import Header from '../_components/Header'
import CalendarPopup from '../_components/CalendarPopUp'

const App = (props: { children: React.ReactNode }) => {
  const { children } = props

  return (
    <main className="grid h-dvh grid-cols-12 gap-3 p-2">
      <Header navTemplate="spread" />
      {children}
      <CalendarPopup />
    </main>
  )
}

export default App
