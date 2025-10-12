'use client'

import Headline from '../_ui/Headline'

const ErrorPage = () => {
  return (
    <Headline title={`Couldn’t find that page...`}>
      <p className="col-span-full">
        Sorry, there was an error loading that page... try again!
      </p>
    </Headline>
  )
}
export default ErrorPage
