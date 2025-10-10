'use client'

import Headline from '../_components/Headline'

const ErrorPage = () => {
  return (
    <Headline title={`Couldn’t find that page...`}>
      <p>Sorry, there was an error loading that page... try again!</p>
    </Headline>
  )
}
export default ErrorPage
