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
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

const lexicalText = lexicalEditor({
  features: [
    ParagraphFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    BoldFeature(),
    UnderlineFeature(),
    LinkFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    FixedToolbarFeature(),
    HeadingFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    IndentFeature(),
    InlineCodeFeature(),
    InlineToolbarFeature(),
  ],
})

export default lexicalText
