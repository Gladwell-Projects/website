import { GlobalConfig } from 'payload'
import { adminsAndEditors } from '@/collections/access/adminsAndEditors'
import { anyone } from '@/collections/access/anyone'
import link from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Site Utilities',
  },
  access: {
    read: anyone,
    update: adminsAndEditors,
  },
  fields: [
    {
      type: 'text',
      name: 'tagline',
    },
    {
      type: 'textarea',
      name: 'siteDescription',
    },
    {
      type: 'checkbox',
      name: 'showCopyright',
      label: 'Show the Copyright line.',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linksPrimary',
          label: 'First Column of Links',
          type: 'array',
          labels: {
            plural: 'Link',
            singular: 'Primary Links',
          },
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: 'src/globals/CustomRowLabelTabs',
            },
            width: '50%',
            description: 'Add links for navigating your website from the footer here.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              type: 'collapsible',
              fields: [
                link({
                  appearances: false,
                  disableLabel: true,
                }),
              ],
              label: 'Link',
            },
          ],
        },
        {
          name: 'linksSecondary',
          label: 'Second Column of Links',
          type: 'array',
          labels: {
            plural: 'Link',
            singular: 'Secondary Links',
          },
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: 'src/globals/CustomRowLabelTabs',
            },
            width: '50%',
            description:
              'Add secondary links here, e.g. Privacy Policy, Terms of Service, Sales Agreements, etc.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              type: 'collapsible',
              fields: [
                link({
                  appearances: false,
                  disableLabel: true,
                }),
              ],
              label: 'Link',
            },
          ],
        },
      ],
    },
  ],
}
