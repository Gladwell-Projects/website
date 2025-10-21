import { NextRequest, NextResponse } from 'next/server'
interface MailchimpErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  instance: string
}
export async function POST(request: NextRequest) {
  try {
    type Form = {
      EMAIL: string
      FNAME: string
      LNAME: string
    }

    const formData: Form = await request.json()
    const email = formData.EMAIL

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const mailchimpData = {
      email_address: email,
      status: 'subscribed', // or 'pending' for a double opt-in
      merge_fields: {
        FNAME: formData.FNAME,
        LNAME: formData.LNAME,
      },
    }

    const url = `https://${process.env.NODE_ENV === 'development' ? process.env.DEV_MAILER : process.env.PROD_MAILER}.api.mailchimp.com/3.0/lists/${process.env.NODE_ENV === 'development' ? process.env.DEV_MAILCHIMP_AUDIENCE : process.env.MAILCHIMP_AUDIENCE_ID}/members`

    const mailchimpResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`anystring:${process.env.NODE_ENV === 'development' ? process.env.MAILCHIMP_DEV_API : process.env.MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify(mailchimpData),
    })

    // console.log('mailchimp response', mailchimpResponse)

    if (!mailchimpResponse.ok) {
      const error = (await mailchimpResponse.json()) as MailchimpErrorResponse
      // console.error('Mailchimp API error:', error)

      const memberExists = error.title === 'Member Exists'

      return NextResponse.json(
        {
          error: memberExists ? `You're already subscribed!` : `Failed to subscribe.`,
        },
        {
          status: mailchimpResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thanks for subscribing!',
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (e) {
    return NextResponse.json(
      { error: e },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
