import Gladwell from 'public/images/Gladwell.svg'
import Projects from 'public/images/Projects.svg'
import Link from 'next/link'

const Logo = ({ className }: { className: string }) => {
  return (
    <div className={`${className} logo-nav w-full place-self-center`}>
      <Link href={'/'} className="flex w-full flex-row justify-between">
        <Gladwell className="h-[var(--text-base)] fill-[var(--theme-text)] transition-[var(--theme-transition)]" />
        <Projects className="h-[var(--text-base)] fill-[var(--theme-text)] transition-[var(--theme-transition)]" />
      </Link>
    </div>
  )
}

export default Logo
