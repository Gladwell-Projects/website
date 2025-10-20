import { Block } from 'payload'
import lexicalHeaders from '../collections/lexical/headers'

export const Headline: Block = {
  slug: 'headline',
  admin: {
    group: 'Text',
  },
  fields: [
    {
      name: 'width',
      type: 'select',
      options: ['half', 'three-quarter', 'full'],
      defaultValue: 'half',
    },
    {
      name: 'headline',
      type: 'richText',
      editor: lexicalHeaders,
    },
  ],
}
