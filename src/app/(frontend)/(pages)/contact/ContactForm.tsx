'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  name: string
  email: string
  newsletter: boolean
  message: string
  subject: string
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [submitted, setSubmitted] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(undefined)
    setIsLoading(true)

    try {
      const req = await fetch(`${getClientSideURL()}/api/contact-submissions`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: 'POST',
      })

      const res = await req.json()

      if (req.status >= 400) {
        setIsLoading(false)
        setError({
          //@ts-expect-error errors is undefined
          message: res.errors?.[0]?.message || 'Internal Server Error',
          //@ts-expect-error status is undefined
          status: res.status,
        })
        return
      }
      setIsLoading(false)
      setSubmitted(true)
    } catch (err) {
      console.warn(err)
      setIsLoading(false)
      setError({
        message: 'Something went wrong.',
      })
    }
  }
  if (submitted) {
    return <div>Thank you, your message has been sent.</div>
  }
  return (
    <form
      className={`form [&_.error]:text-brick ${isLoading ? 'opacity-50' : ''} [&>div]:my-2`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <span className="error">{error.message}</span>}
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          aria-invalid={errors.name ? 'true' : 'false'}
          readOnly={isLoading}
          {...register('name', { required: true })}
          placeholder="Your Name"
        />
        {errors.name && (
          <span className="error" role="alert">
            This field is required.
          </span>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          readOnly={isLoading}
          aria-invalid={errors.email ? 'true' : 'false'}
          {...register('email', {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          })}
          placeholder="Your Email Address"
        />
        {errors.email && (
          <span className="error" role="alert">
            Please use a valid email address.
          </span>
        )}
      </div>
      <div>
        <input
          type="checkbox"
          disabled={isLoading}
          id="newsletter"
          {...register('newsletter', { required: false })}
        />
        <label htmlFor="newsletter">Add me to the mailing list</label>
      </div>
      <div>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          disabled={isLoading}
          aria-invalid={errors.name ? 'true' : 'false'}
          readOnly={isLoading}
          placeholder="Subject"
          className="mb-2"
          id="subject"
          {...register('subject', { required: true })}
        />
        {errors.subject && (
          <span className="error" role="alert">
            Please include a subject.
          </span>
        )}
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          readOnly={isLoading}
          aria-invalid={errors.message ? 'true' : 'false'}
          {...register('message', { required: true })}
          placeholder="Write your message..."
        />
        {errors.message && (
          <span className="error" role="alert">
            Please write a message.
          </span>
        )}
      </div>
      <button className="w-full cursor-pointer rounded-full border-2 p-1 hover:border-transparent hover:bg-(--theme-text) hover:text-(--theme-bg)">
        Submit
      </button>
    </form>
  )
}
export default ContactForm
