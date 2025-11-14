import Gladwell from 'public/images/Gladwell.svg'
import Projects from 'public/images/Projects.svg'
import GladwellProjects from 'public/images/Gladwell-Projects.svg'
import Link from 'next/link'

const Logo = ({ className, variant }: { className: string; variant?: string }) => {
  return (
    <div className={`${className} logo-nav w-full place-self-center`}>
      <Link
        href={'/'}
        className="flex w-full flex-row justify-between"
        aria-label="navigate home"
        title="Gladwell Projects Logo"
        role="button"
      >
        {variant === 'stacked' && (
          <GladwellProjects className="mb-1 h-6 overflow-visible fill-(--theme-text) transition-(--theme-transition)" />
        )}
        {variant !== 'stacked' && (
          <>
            <Gladwell
              aria-label="Gladwell"
              className="h-(--text-base) overflow-visible fill-(--theme-text) transition-(--theme-transition)"
            />
            <Projects
              aria-label="Projects"
              className="h-(--text-base) overflow-visible fill-(--theme-text) transition-(--theme-transition)"
            />
          </>
        )}
      </Link>
    </div>
  )
}

export default Logo
