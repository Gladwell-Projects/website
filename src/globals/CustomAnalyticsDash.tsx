'use client'
import { useEffect } from 'react'

import IFrameResizer from '@iframe-resizer/react'

const CustomAnalyticsDash: React.FC<{}> = ({}) => {
  const fathomURL = process.env.FATHOM_DASHBOARD

  return (
    <>
      <IFrameResizer
        license="GPLv3"
        src={fathomURL}
        bodyBackground="transparent"
        style={{ width: '100%', height: '100vh', border: 'none', outline: 'none' }}
      />
    </>
  )
}

export default CustomAnalyticsDash
