import Newsletter from '../../_ui/Newsletter'
import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

const PressPage: React.FC = () => {
  return <Newsletter />
}

export default PressPage

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/newsletter',
    meta: {
      title: 'Mailing List | Gladwell Projects',
      description: 'Join the Gladwell Projects Mailing List',
    },
  }

  return generateMeta({ doc: page })
}
