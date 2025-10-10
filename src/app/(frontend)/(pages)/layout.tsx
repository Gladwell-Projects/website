import React from 'react'
import Header from '../_components/Header'
import Footer from '../_components/Footer'

const App = async (props: { children: React.ReactNode }) => {
  const { children } = props

  return (
    <main className={`grid grid-cols-12 gap-3 p-2 pt-[var(--nav-height)]`}>
      <Header navTemplate="condensed" />
      {children}
      <Footer />
    </main>
  )
}

export default App
