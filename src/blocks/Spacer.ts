import { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  admin: {
    group: 'Other',
  },
  fields: [
    {
      name: 'spaceWidth',
      type: 'select',
      options: [
        { label: 'Full', value: 'full' },
        {
          label: 'Half',
          value: 'half',
        },
      ],
      defaultValue: 'half',
    },
  ],
}
