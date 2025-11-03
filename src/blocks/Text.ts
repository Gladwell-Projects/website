import lexicalText from '@/collections/lexical/allTextFeatures'
import { Block } from 'payload'

export const Text: Block = {
  slug: 'text',
  labels: { plural: 'Rich Text', singular: 'Rich Text' },
  admin: {
    group: 'Text',
  },
  fields: [
    {
      name: 'col',
      label: 'Column',
      type: 'select',
      options: [
        { label: 'Left', value: '1' },
        { label: 'Right', value: '7' },
      ],
      defaultValue: '1',
    },
    {
      name: 'text',
      type: 'richText',
      editor: lexicalText,
    },
  ],
}
