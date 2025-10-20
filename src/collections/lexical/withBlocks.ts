import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { defaultFeatures } from './defaultFeatures'

const lexicalWithBlocks = lexicalEditor({
  features: [
    ...defaultFeatures,
    BlocksFeature({
      blocks: [],
    }),
  ],
})

export default lexicalWithBlocks
