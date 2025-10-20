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
} from '@payloadcms/richtext-lexical'

const lexicalBasic = lexicalEditor({
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
  ],
})

export default lexicalBasic
