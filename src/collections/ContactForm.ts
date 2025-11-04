import { CollectionConfig } from 'payload'
import { adminsAndEditors } from './access/adminsAndEditors'
import { admins } from './access/admins'
import { anyone } from './access/anyone'
import { getServerSideURL } from '@/utilities/getURL'

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
              await fetch(`${getServerSideURL()}/api/subscribe`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              })
              return
            } catch (err) {
              console.warn(err)
              return
            }
          }
          return
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
