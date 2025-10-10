import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const CvItem: Block = {
  slug: 'CvItem', // required
  imageURL: '',
  imageAltText: '',
  interfaceName: 'cvItem', // optional
  labels: { singular: 'CV Item', plural: 'CV Items' },
  fields: [
    // required
    {
      type: 'row',
      fields: [
        {
          name: 'Year',
          type: 'number',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: [
              BoldFeature(),
              ItalicFeature(),
              StrikethroughFeature(),
              SuperscriptFeature(),
              SubscriptFeature(),
              UnderlineFeature(),
              ParagraphFeature(),
            ],
          }),
        },
      ],
    },
  ],
}

export const CvBreak: Block = {
  slug: 'CvLineBreak',
  labels: { singular: 'Line Break', plural: 'Line Breaks' },
  fields: [],
}

export const CvHeading: Block = {
  slug: 'CvHeading',
  labels: { singular: 'Heading', plural: 'Headings' },
  fields: [
    {
      type: 'text',
      name: 'Headline',
      required: true,
    },
    {
      name: 'text',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          ItalicFeature(),
          StrikethroughFeature(),
          SuperscriptFeature(),
          SubscriptFeature(),
          UnderlineFeature(),
          ParagraphFeature(),
        ],
      }),
    },
  ],
}
