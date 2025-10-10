'use client'

import { SupportedTimezones } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Suspense, useState } from 'react'
import { Value } from 'react-calendar/dist/shared/types.js'
import { CMSLink } from '../CMSLinks'
import { fetcher, query } from './getEvents'
import useSWR from 'swr'
import { getClientSideURL } from '@/utilities/getURL'

const dateFormat: Intl.DateTimeFormatOptions = {
  timeZone: 'America/New_York',
  year: 'numeric',
  day: 'numeric',
  month: 'numeric',
}

const convertTime = (
  datestring: string,
  timeZone: SupportedTimezones,
  hasTime: boolean
) => {
  const dateObject = new Date(datestring)

  if (hasTime) {
    return dateObject.toLocaleString('en-US', {
      timeZone: timeZone || 'America/New_York',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    })
  }

  return dateObject.toLocaleString('en-US', {
    timeZone: timeZone || 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const CalendarEventList = (props: {
  date: Value
  changeDate: (
    value: Value,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void
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

  const activeMonthString = startingDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <ul>
      {error && !isLoading && 'there was an error loading the calendar...'}

      <li className="events-headline sticky p-4">
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
            const dateMatches =
              new Date(date.toString()).toLocaleString('en-US', dateFormat) ===
              new Date(e.startDate).toLocaleDateString('en-US', dateFormat)
            return (
              <li
                key={e.id}
                className={`w-full list-none p-4 hover:bg-[var(--theme-highlight)] ${dateMatches ? 'bg-[var(--theme-highlight)]' : ''}`}
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
                  {convertTime(e.startDate, e.startDate_tz, false)}
                  {new Date(e.startDate).toLocaleDateString(
                    'en-us',
                    dateFormat
                  ) ===
                  new Date(e.endDate).toLocaleDateString('en-us', dateFormat)
                    ? ''
                    : e.endDate &&
                      '—' + convertTime(e.endDate, e.endDate_tz, false)}
                </strong>
                <footer>
                  {e.hasTime &&
                    convertTime(e.startDate, e.startDate_tz, e.hasTime)}
                  {e.hasTime && '—'}
                  {e.hasTime && convertTime(e.endDate, e.endDate_tz, e.hasTime)}
                </footer>
                {openEvent === e.id && (
                  <div className="event-details p-0">
                    <RichText data={e.content} />
                    {e.isLinked && (
                      <CMSLink {...e.link}>
                        {e.link.newTab ? ' ↗︎' : ''}
                      </CMSLink>
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
