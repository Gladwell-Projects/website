'use client'
import { useState } from 'react'
import { ModalItem } from '../Modal'
import { useForm, SubmitHandler } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'

type Inputs = {
  FNAME: string
  LNAME: string
  EMAIL: string
}

const Newsletter = () => {
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [submitted, setSubmitted] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(undefined)
    setIsLoading(true)

    try {
      const body = JSON.stringify(data)
      const response = await fetch(`${getClientSideURL()}/api/subscribe`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        method: 'POST',
      })

      if (response.status >= 400) {
        setIsLoading(false)
        const json = await response.json()
        setError({
          //@ts-expect-error errors is undefined
          message: json.error || 'Internal Server Error',
          //@ts-expect-error status is undefined
          status: response.status,
        })
        return
      }
      setIsLoading(false)
      setSubmitted(true)
    } catch (e) {
      console.warn(e)
      setIsLoading(false)
      setError({
        message: 'Something went wrong.',
      })
    }
  }

  if (submitted) {
    return (
      <ModalItem className="col-span-full col-start-1 row-start-2 m-auto w-full lg:col-span-6 lg:col-start-4 lg:w-full">
        <div>Thanks! You&apos;ve been signed up for our mailing list.</div>
      </ModalItem>
    )
  }

  return (
    <ModalItem className="col-span-full col-start-1 row-start-2 m-auto w-full lg:col-span-6 lg:col-start-4 lg:w-full">
      <p>Sign up for the mailing list</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`form [&_.error]:text-brick ${isLoading ? 'opacity-50' : ''}`}
      >
        {error && error.message && <span className="error">{error.message}</span>}
        <fieldset>
          <label htmlFor="mce-EMAIL">Email</label>
          <input
            type="email"
            name="EMAIL"
            id="mce-EMAIL"
            aria-invalid={errors.EMAIL ? 'true' : 'false'}
            {...register('EMAIL', {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            placeholder="Email Address"
          />
          {errors.EMAIL && <span className="error">Not a valid email</span>}
        </fieldset>
        <fieldset>
          <label htmlFor="mce-FNAME">First Name</label>
          <input
            type="text"
            name="FNAME"
            id="mce-FNAME"
            aria-invalid={errors.FNAME ? 'true' : 'false'}
            {...register('FNAME', { required: true })}
            placeholder="First Name"
          />
          {errors.FNAME && <span className="error">This field is required.</span>}
        </fieldset>
        <fieldset>
          <label htmlFor="mce-LNAME">Last Name</label>
          <input
            type="text"
            name="LNAME"
            id="mce-LNAME"
            aria-invalid={errors.LNAME ? 'true' : 'false'}
            {...register('LNAME', { required: true })}
            placeholder="Last Name"
          />
          {errors.LNAME && <span className="error">This field is required.</span>}
        </fieldset>
        <button className="w-full cursor-pointer rounded-full border-2 p-1 hover:border-transparent hover:bg-(--theme-text) hover:text-(--theme-bg)">
          Submit
        </button>
      </form>
    </ModalItem>
  )
}

export default Newsletter
