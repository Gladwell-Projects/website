import GladwellProjects from 'public/images/Gladwell-Projects.svg'
const Footer = (props: { children?: React.ReactNode }) => {
  return (
    <div
      className={`footer mt-4 grid grid-cols-12 justify-center gap-3 bg-gradient-to-b from-(--theme-bg) from-50% to-(--theme-accent) px-2 py-8 text-sm md:place-items-start`}
    >
      <div className="col-span-full grid grid-cols-subgrid md:col-span-6">
        <GladwellProjects className="col-span-full mb-2 h-6 w-auto fill-(--theme-text) md:col-span-2" />
        <div className="tagline col-span-full">
          <strong>Do Nothing Without Intention</strong>
          <p>Gladwell Projects is a bla bla bla</p>
          <p>
            © Copyright{' '}
            {new Date().toLocaleDateString('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
            })}{' '}
            Gladwell Projects
          </p>
        </div>
      </div>
      <div className="col-span-full grid grid-cols-subgrid md:col-span-6">
        <div className="col-span-full grid grid-cols-subgrid">
          <div className="col-span-6 flex flex-col md:col-span-3">
            <a href="" className="col-span-full font-bold md:col-span-3">
              About
            </a>
            <a href="" className="col-span-3 font-bold">
              Exhibitions
            </a>
            <a href="" className="col-span-3 font-bold">
              Artists
            </a>
            <a href="" className="col-span-3 font-bold">
              Events
            </a>
            <a href="" className="col-span-3 font-bold">
              Press
            </a>
            <a href="" className="col-span-3 font-bold">
              Viewing Rooms
            </a>
          </div>
          <div className="col-span-6 flex flex-col md:col-span-3">
            <a href="" className="col-span-3 font-bold">
              Mailing List
            </a>
            <span>&nbsp;</span>
            <a href="" className="col-span-3">
              Privacy Policy
            </a>
            <a href="" className="col-span-3">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer
