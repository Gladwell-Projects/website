import GladwellProjects from 'public/images/Gladwell-Projects.svg'
import { fetchGlobals } from '../../_data'
import { CMSLink } from '../CMSLinks'
import A18y from '../A11yPopup'

const Footer = async (props: { children?: React.ReactNode }) => {
  const { children } = props

  const footer = (await fetchGlobals()).footer

  return (
    <footer
      aria-label="site footer"
      className={`footer relative mt-4 grid grid-cols-12 justify-center gap-3 bg-linear-to-b from-transparent from-50% to-(--theme-accent) px-2 py-8 text-sm transition-all md:place-items-start lg:text-xs`}
    >
      <div className="col-span-full grid grid-cols-subgrid md:col-span-6">
        <GladwellProjects
          aria-label="Gladwell Projects Logo"
          alt="Gladwell Projects logo"
          title="Gladwell Projects Logo"
          className="col-span-full mb-2 h-8 w-auto fill-(--theme-text) md:col-span-2 md:h-6"
        />
        <div className="tagline col-span-full">
          <div className="font-bold">{footer.tagline}</div>
          <div>{footer.siteDescription}</div>
          {children}
          <br />
          {footer.showCopyright && (
            <p className="m-0">
              © Copyright{' '}
              {new Date().toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
              })}{' '}
              Gladwell Projects
            </p>
          )}
        </div>
      </div>
      <div className="col-span-full grid grid-cols-subgrid text-lg md:col-span-6 md:text-sm lg:text-xs">
        <div className="col-span-full font-bold md:col-span-3">
          {footer.linksPrimary.map((a) => {
            return (
              // @ts-expect-error number isn't expected here.
              <CMSLink
                key={a.id}
                className={`block py-2 md:p-0`}
                {...a.link}
                label={a.label}
              />
            )
          })}
        </div>
        <div className="col-span-full mt-2 font-normal md:col-span-3 md:mt-0">
          {footer.linksSecondary.map((a) => {
            return (
              // @ts-expect-error number isn't expected here.
              <CMSLink
                key={a.id}
                className={`block py-2 md:p-0`}
                {...a.link}
                label={a.label}
              />
            )
          })}
        </div>
      </div>
      <A18y />
    </footer>
  )
}
export default Footer
