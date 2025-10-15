import React from 'react'
import { notFound } from 'next/navigation'
import { fetchAllPages } from '../_data'
import Content from '../_ui/PageContent'
import SubGrid from '../_ui/pageGrid'

const getPage = async () => fetchAllPages()

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  // const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)
  const page = await getPage()

  if (!page) {
    notFound()
  }

  return (
    <SubGrid>
      <Content>
        {page.map((p) => {
          console.log(JSON.stringify(p, null, 2))
          return null
        })}
      </Content>
    </SubGrid>
  )
}

export default Page

// // Return a list of `params` to populate the [slug] dynamic segment
// export async function generateStaticParams() {
//   const pages = await fetchPages()

//   console.log(pages)

//   return pages.map((page) => ({
//     slug: page.slug,
//   }))
// }
