// process.env.FATHOM_DASHBOARD

import { adminsAndEditors } from '@/collections/access/adminsAndEditors'
import { GlobalConfig } from 'payload'

const AnalyticsDash: GlobalConfig = {
  slug: 'analytics',
  admin: {
    group: 'Site Utilities',
    hideAPIURL: true,
  },
  access: {
    read: adminsAndEditors,
    update: () => {
      return false
    },
  },
  fields: [
    {
      type: 'ui',
      name: 'dashboard',
      admin: {
        components: {
          Field: 'src/globals/CustomAnalyticsDash',
        },
      },
    },
  ],
}

export default AnalyticsDash
