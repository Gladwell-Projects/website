'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { Suspense, useState } from 'react'
import { CMSLink } from '../CMSLinks'
import { fetcher, query } from './getEvents'
import useSWR from 'swr'
import { getClientSideURL } from '@/utilities/getURL'
import {
  dateMonthYear,
  dateToLong,
  dateToNumeric,
  timeOnly,
} from '../../_helpers/convertCMSDate'

const CalendarEventList = (props: {
  date: Date
  changeDate: (value: Date, event?: React.MouseEvent<HTMLButtonElement>) => void
  activeMonth: Date
  setActiveMonth?: (date: Date | null) => void
}) => {
  const { date, changeDate } = props
  const [openEvent, setOpenEvent] = useState(null)

  const dateQuery = query(date.toString())

  const { data, isLoading, error } = useSWR(
    () => `${getClientSideURL()}/api/events${dateQuery}`,
    fetcher,
    { suspense: true }
  )

  const events = data.docs || []

  const startingDate = Array.isArray(date) ? date[0] : date

  const activeMonthString = dateMonthYear(startingDate)

  return (
    <ul>
      {error && !isLoading && 'there was an error loading the calendar...'}

      <li className="events-headline sticky p-3">
        <h6>{activeMonthString}</h6>
      </li>
      <Suspense
        fallback={
          <li>
            <h3>Loading...</h3>
          </li>
        }
      >
        {events.length > 0 ? (
          events.map((e) => {
            const dateMatches = dateToNumeric(date) === dateToNumeric(e.startDate)
            return (
              <li
                key={e.id}
                className={`w-full list-none p-3 hover:bg-[var(--theme-highlight)] ${dateMatches ? 'bg-[var(--theme-highlight)]' : ''}`}
                onClick={() => {
                  if (openEvent === e.id) {
                    setOpenEvent(null)
                  } else {
                    setOpenEvent(e.id)
                  }
                  changeDate(new Date(e.startDate))
                }}
              >
                <h3 className="cursor-pointer">
                  <span>{e.title}</span>
                  <span></span>
                </h3>
                <strong>
                  {dateToLong(e.startDate, e.startDate_tz)}
                  {dateToLong(e.startDate) === dateToLong(e.endDate)
                    ? ''
                    : e.endDate && '—' + dateToLong(e.endDate, e.endDate_tz)}
                </strong>
                <footer>
                  {e.hasTime && timeOnly(e.startDate, e.startDate_tz)}
                  {e.hasTime && '—'}
                  {e.hasTime && timeOnly(e.endDate, e.endDate_tz)}
                </footer>
                {openEvent === e.id && (
                  <div className="event-details p-0">
                    <RichText data={e.content} />
                    {e.isLinked && (
                      <CMSLink {...e.link}>{e.link.newTab ? ' ↗︎' : ''}</CMSLink>
                    )}
                  </div>
                )}
              </li>
            )
          })
        ) : (
          <li className="p-4 text-center">
            <strong>There are no events for {activeMonthString}</strong>
          </li>
        )}
      </Suspense>
    </ul>
  )
}

export default CalendarEventList
