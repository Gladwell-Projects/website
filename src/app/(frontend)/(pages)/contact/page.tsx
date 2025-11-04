import { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { ModalItem } from '../../_ui/Modal'
import Content from '../../_ui/PageContent'
import ContactForm from './ContactForm'

const PressPage: React.FC = () => {
  return (
    <Content>
      <ModalItem className="col-span-full md:col-span-6">
        <h1>Contact Us</h1>
        <ContactForm />
      </ModalItem>
    </Content>
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({}: Args): Promise<Metadata> {
  const page = {
    slug: '/contact',
    meta: {
      title: 'Contact | Gladwell Projects',
      description: 'Contact Us',
    },
  }

  return generateMeta({ doc: page })
}

export default PressPage
