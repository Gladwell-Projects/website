import type { CollectionConfig } from 'payload'
import { admins, adminsField } from './access/admins'
import { adminsAndEditors } from './access/adminsAndEditors'
import { adminsAndSelf } from './access/adminsAndSelf'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { plural: 'Client Accounts', singular: 'Client' },
  admin: {
    useAsTitle: 'name',
    group: 'Website',
    hidden: true,
  },
  access: {
    read: adminsAndSelf,
    create: adminsAndEditors,
    update: adminsAndEditors,
    delete: admins,
    unlock: admins,
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      type: 'text',
      name: 'name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      access: {
        update: adminsField,
      },
      options: [
        {
          label: 'Client',
          value: 'user',
        },
      ],
      defaultValue: ['user'],
      required: true,
    },
  ],
}
