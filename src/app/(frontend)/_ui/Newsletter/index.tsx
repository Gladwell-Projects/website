import { ModalItem } from '../Modal'

const Newsletter = () => {
  return (
    <ModalItem className="col-span-full col-start-1 w-max place-self-center lg:col-span-6 lg:col-start-4">
      <form
        // onSubmit={submitNewsletter}
        className={
          'grid h-auto w-full auto-rows-min grid-cols-1 gap-y-2 md:mt-0 md:min-h-full md:auto-rows-auto md:grid-cols-2 md:place-items-start md:gap-2 md:gap-y-2'
        }
      >
        <label
          className="-mb-2 block h-auto min-h-[1em] text-sm md:py-1"
          htmlFor="mce-EMAIL"
        >
          Email
        </label>
        <input
          className="block w-full border-b-2 py-1"
          type="email"
          name="EMAIL"
          id="mce-EMAIL"
          // value={email}
          // onChange={t => setEmail(t.target.value)}
          placeholder="Email Address"
          required
        />
        <label
          className="-mb-2 block h-auto min-h-[1em] text-sm md:py-1"
          htmlFor="mce-FNAME"
        >
          First Name
        </label>
        <input
          className="block w-full border-b-2 py-1"
          type="text"
          name="FNAME"
          id="mce-FNAME"
          // value={first}
          // onChange={t => setFirst(t.target.value)}
          placeholder="First Name"
          required
        />
        <label
          className="-mb-2 block h-auto min-h-[1em] text-sm md:py-1"
          htmlFor="mce-LNAME"
        >
          Last Name
        </label>
        <input
          className="block w-full border-b-2 py-1"
          type="text"
          name="LNAME"
          id="mce-LNAME"
          // value={last}
          // onChange={t => setLast(t.target.value)}
          placeholder="Last Name"
          required
        />
        <div className="place-self-stretch text-center md:col-span-2">
          <button className="w-full cursor-pointer rounded-full border-2 p-1 hover:border-transparent hover:bg-(--theme-text) hover:text-(--theme-bg)">
            Submit
          </button>
        </div>
      </form>
      {/* <div
        className={
          '' +
          (formStatus ? 'text-green-600' : ' text-hi-vis pt-6') +
          (message ? ' visible' : ' hidden')
        }
      >
        {message}
      </div> */}
    </ModalItem>
  )
}

export default Newsletter
