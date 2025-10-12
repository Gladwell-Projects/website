import React from 'react'
import Header from '../_ui/Header'
import Footer from '../_ui/Footer'

const App = async (props: { children: React.ReactNode }) => {
  const { children } = props

  return (
    <>
      <main
        className={`grid flex-grow-1 grid-cols-12 place-items-start gap-3 p-2 pt-[var(--nav-height)]`}
      >
        <Header navTemplate="condensed" />
        {children}
      </main>
      <Footer />
    </>
  )
}

export default App
