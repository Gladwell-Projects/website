import GladwellProjects from 'public/images/Gladwell-Projects.svg'
import { fetchGlobals } from '../../_data'
import { CMSLink } from '../CMSLinks'

const Footer = async (props: { children?: React.ReactNode }) => {
  const { children } = props

  const footer = (await fetchGlobals()).footer

  return (
    <div
      className={`footer mt-4 grid grid-cols-12 justify-center gap-3 bg-gradient-to-b from-(--theme-bg) from-50% to-(--theme-accent) px-2 py-8 text-xs md:place-items-start`}
    >
      <div className="col-span-full grid grid-cols-subgrid md:col-span-6">
        <GladwellProjects className="col-span-full mb-2 h-6 w-auto fill-(--theme-text) md:col-span-2" />
        <div className="tagline col-span-full">
          <div className="font-bold">{footer.tagline}</div>
          <div>{footer.siteDescription}</div>
          {children}
          <br />
          {footer.showCopyright && (
            <p>
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
      <div className="col-span-full grid grid-cols-subgrid md:col-span-6">
        <div className="col-span-full columns-2 gap-3">
          {footer.linksPrimary.map((a) => {
            return (
              // @ts-expect-error number isn't expected here.
              <CMSLink
                key={a.id}
                className={`block font-bold`}
                {...a.link}
                label={a.label}
              />
            )
          })}
          {footer.linksSecondary.map((a, i) => {
            return (
              // @ts-expect-error number isn't expected here.
              <CMSLink
                key={a.id}
                className={`${i === 0 && 'mt-3'} block font-normal`}
                {...a.link}
                label={a.label}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default Footer
