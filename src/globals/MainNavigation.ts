import type { GlobalConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import link from '../fields/link'
import { adminsAndEditors } from '@/collections/access/adminsAndEditors'
import { anyone } from '@/collections/access/anyone'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Navigation Menu',
  access: {
    read: anyone,
    update: adminsAndEditors,
  },
  admin: {
    group: 'Site Utilities',
  },
  fields: [
    {
      name: 'menu-items-top',
      type: 'array',
      labels: { plural: 'Menu Items', singular: 'Menu Item' },
      admin: {
        components: {
          RowLabel: 'src/globals/CustomRowLabelTabs',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'theme',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.link.type === 'custom',
          },
        },
        {
          type: 'collapsible',
          fields: [
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
          label: 'Direct Link',
        },
      ],
      label: 'Top Menu Items',
    },
    {
      name: 'menu-items-bot',
      labels: { plural: 'Menu Items', singular: 'Menu Item' },
      type: 'array',
      admin: {
        components: {
          RowLabel: 'src/globals/CustomRowLabelTabs',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'theme',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.link.type === 'custom',
          },
        },
        {
          type: 'collapsible',
          fields: [
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
          label: 'Direct Link',
        },
      ],
      label: 'Bottom Menu Items',
    },
  ],
  hooks: {
    afterChange: [() => revalidatePath('/', 'layout')],
  },
}
