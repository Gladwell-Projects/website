import {
  lexicalEditor,
  BoldFeature,
  UnderlineFeature,
  LinkFeature,
  ItalicFeature,
  FixedToolbarFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  ParagraphFeature,
  InlineCodeFeature,
  HeadingFeature,
  BlockquoteFeature,
  UploadFeature,
  UnorderedListFeature,
  OrderedListFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'

export const defaultFeatures = [
  HeadingFeature(),
  ParagraphFeature(),
  BoldFeature(),
  UnderlineFeature(),
  ItalicFeature(),
  LinkFeature(),
  BlockquoteFeature(),
  UploadFeature(),
  HorizontalRuleFeature(),
  UnderlineFeature(),
  InlineCodeFeature(),
  StrikethroughFeature(),
  SubscriptFeature(),
  SuperscriptFeature(),
  FixedToolbarFeature(),
  OrderedListFeature(),
  UnorderedListFeature(),
]

const lexicalDefault = lexicalEditor({
  features: [...defaultFeatures],
})

export default lexicalDefault
