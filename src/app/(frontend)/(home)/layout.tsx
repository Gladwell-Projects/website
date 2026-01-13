import React from 'react'
import Header from '../_ui/Header'
import { WebSite, WithContext } from 'schema-dts'

const App = (props: { children: React.ReactNode }) => {
  const { children } = props

  const jsonLD: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gladwell Projects',
    url: 'https://www.gladwellprojects.com',
  }

  return (
    <main className="grid min-h-dvh grid-cols-12 gap-3 p-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLD).replace(/</g, '\\u003c'),
        }}
      ></script>
      <Header navTemplate="spread" />
      {children}
    </main>
  )
}

export default App
