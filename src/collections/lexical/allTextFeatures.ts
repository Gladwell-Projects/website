import {
  lexicalEditor,
  HeadingFeature,
  BoldFeature,
  FixedToolbarFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

const lexicalText = lexicalEditor({
  features: [
    BoldFeature(),
    UnderlineFeature(),
    LinkFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    ParagraphFeature(),
    FixedToolbarFeature(),
    HeadingFeature(),
  ],
})

export default lexicalText
