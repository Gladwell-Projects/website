import Gladwell from '@/public/images/Gladwell.svg'
import Projects from '@/public/images/Projects.svg'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <div className="logo-nav place-self-center w-full">
      <Link href={'/'} className="w-full flex flex-row justify-between">
        <Gladwell className='h-[var(--text-md)] fill-[var(--theme-text)] transition-[var(--theme-transition)]' />
        <Projects className='h-[var(--text-md)] fill-[var(--theme-text)] transition-[var(--theme-transition)]' />
      </Link>
    </div>
  )
}

export default Logo