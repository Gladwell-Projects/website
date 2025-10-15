import Gladwell from 'public/images/Gladwell.svg'
import Projects from 'public/images/Projects.svg'
import GladwellProjects from 'public/images/Gladwell-Projects.svg'
import Link from 'next/link'

const Logo = ({ className, variant }: { className: string; variant?: string }) => {
  return (
    <div className={`${className} logo-nav w-full place-self-center`}>
      <Link href={'/'} className="flex w-full flex-row justify-between">
        {variant === 'stacked' && (
          <GladwellProjects className="mb-1 h-[--spacing(6)] overflow-visible fill-[var(--theme-text)] transition-[var(--theme-transition)]" />
        )}
        {variant !== 'stacked' && (
          <>
            <Gladwell className="h-[var(--text-base)] overflow-visible fill-[var(--theme-text)] transition-[var(--theme-transition)]" />
            <Projects className="h-[var(--text-base)] overflow-visible fill-[var(--theme-text)] transition-[var(--theme-transition)]" />
          </>
        )}
      </Link>
    </div>
  )
}

export default Logo
