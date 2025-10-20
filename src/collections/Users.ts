import type { CollectionConfig } from 'payload'
import { admins, adminsField } from './access/admins'
import { adminsAndSelf } from './access/adminsAndSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { plural: 'Admin Users', singular: 'Admin User' },
  admin: {
    useAsTitle: 'email',
    group: 'Site Utilities',
  },
  access: {
    read: adminsAndSelf,
    create: admins,
    update: adminsAndSelf,
    delete: admins,
    unlock: admins,
  },

  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      required: true,
      access: {
        update: adminsField,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User (Read Only)',
          value: 'user',
        },
      ],
    },
  ],
}
