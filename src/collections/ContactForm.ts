import { CollectionConfig } from 'payload'
import { adminsAndEditors } from './access/adminsAndEditors'
import { admins } from './access/admins'
import { anyone } from './access/anyone'
import { getServerSideURL } from '@/utilities/getURL'
import { dateToLong, timeOnly } from '@/utilities/convertCMSDate'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    read: adminsAndEditors,
    create: anyone,
    update: () => false,
    delete: admins,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        const newData = { ...data, date: new Date() }

        return newData
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          if (doc.newsletter) {
            const data = {
              EMAIL: doc.email,
              FNAME: doc.name,
            }
            try {
              const req = await fetch(`${getServerSideURL()}/api/subscribe`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })

              const res = await req.json()

              if (!req.ok) {
                return
              }

              return res
            } catch (err) {
              console.warn(err)
              return
            }
          }
          return
        }
        return
      },
      async ({ req: { payload }, doc, operation }) => {
        if (operation === 'create') {
          const email = await payload.sendEmail({
            to: 'info@itsallwong.com',
            replyTo: `${doc.email}`,
            subject: `Message from: ${doc.name}`,
            html: `<small style="color:gray">### This email comes from an unmonitored inbox. Replies will be sent to the form submitter at ${doc.email}</small>
            <br />
            Submitted on: ${dateToLong(doc.date)} at ${timeOnly(doc.date)}
            <br />
            <br />
            <div style="white-space:pre-wrap;">
            ${doc.message}
            </div>
            <br />
            <br />
            <small>This email was sent to you via ${process.env.NEXT_PUBLIC_SERVER_URL}</small>`,
          })
          return email
        }
        return
      },
    ],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'newsletter',
      label: 'Joined Newsletter',
      type: 'checkbox',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
  ],
}
