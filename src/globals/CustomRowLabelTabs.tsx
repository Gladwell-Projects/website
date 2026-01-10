'use client'
import type { PayloadClientReactComponent, RowLabelComponent } from 'payload'

import { useRowLabel } from '@payloadcms/ui'

const CustomRowLabelTabs: PayloadClientReactComponent<RowLabelComponent> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = useRowLabel<any>()

  return data.label || '...'
}

export default CustomRowLabelTabs
