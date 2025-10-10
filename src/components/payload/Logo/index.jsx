'use client'
import { useTheme } from '@payloadcms/ui'
import LogoSVG from './STACKED-DARK.svg'

const Logo = () => {
  const { theme } = useTheme()

  return <LogoSVG width="300" fill={theme === 'light' ? '#1511BE' : '#F5F6FF'} />
}

export default Logo