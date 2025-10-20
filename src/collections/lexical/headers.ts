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
  HeadingFeature,
} from '@payloadcms/richtext-lexical'

const lexicalHeaders = lexicalEditor({
  admin: {
    hideAddBlockButton: true,
    hideDraggableBlockElement: true,
    hideInsertParagraphAtEnd: true,
    hideGutter: true,
  },
  features: [
    HeadingFeature(),
    BoldFeature(),
    UnderlineFeature(),
    LinkFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    FixedToolbarFeature(),
  ],
})

export default lexicalHeaders
