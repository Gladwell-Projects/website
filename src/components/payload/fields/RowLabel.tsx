'use client'

import { useRowLabel } from '@payloadcms/ui'

const ArrayRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    title?: string
    isProtected?: boolean
    isVisible?: boolean
  }>()

  const customLabel = `${!data.isVisible ? 'Hidden —' : ''} ${rowNumber} — ${data.title || 'Navigation Item'}${data && data.isProtected ? '—[DO NOT DELETE]' : ''}`

  return <div>{customLabel}</div>
}

export default ArrayRowLabel
