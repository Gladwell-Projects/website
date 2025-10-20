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
      name: 'text',
      type: 'richText',
      editor: lexicalText,
    },
  ],
}
