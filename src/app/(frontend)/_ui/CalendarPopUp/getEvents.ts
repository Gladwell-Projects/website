import { PaginatedDocs, Where } from 'payload'
import { stringify } from 'qs-esm'
import type { Fetcher } from 'swr'

export const fetcher: Fetcher<PaginatedDocs, string> = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')

    throw error
  }

  return res.json()
}

export const query = (date: string) => {
  const month = new Date(date).getMonth()
  const lastofMonth = new Date(date).setMonth(month + 1, 0)
  const firstofMonth = new Date(date).setDate(1)

  const monthQuery: Where = {
    and: [
      {
        startDate: {
          less_than_equal: new Date(lastofMonth),
        },
      },
      {
        startDate: {
          greater_than_equal: new Date(firstofMonth),
        },
      },
    ],
  }

  const stringifiedQuery = stringify(
    {
      where: monthQuery, // ensure that `qs-esm` adds the `where` property, too!
    },
    { addQueryPrefix: true }
  )

  return stringifiedQuery
}
