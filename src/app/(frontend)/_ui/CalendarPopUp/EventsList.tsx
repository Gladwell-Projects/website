'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState } from 'react'
import { CMSLink } from '../CMSLinks'
import { fetcher, query } from './getEvents'
import useSWR from 'swr'
import { getClientSideURL } from '@/utilities/getURL'
import {
  dateMonthYear,
  dateToLong,
  dateToNumeric,
  timeOnly,
} from '../../../../utilities/convertCMSDate'

export const DefaultList = ({ activeMonthString }: { activeMonthString: string }) => {
  return (
    <ul>
      <li className="events-headline sticky p-1 md:p-2">
        <h6 className="text-base md:text-lg">{activeMonthString}</h6>
      </li>
      <li className="w-full list-none px-1 py-2 text-center hover:bg-[var(--theme-highlight)] md:px-2">
        Loading events...
      </li>
    </ul>
  )
}

const CalendarEventList = (props: {
  date: Date
  changeDate: (value: Date, event?: React.MouseEvent<HTMLButtonElement>) => void
  activeMonth: Date
  setActiveMonth?: (date: Date | null) => void
}) => {
  const { date, changeDate, activeMonth } = props
  const [openEvent, setOpenEvent] = useState(null)

  const dateQuery = query(date.toString())

  const activeMonthString = dateMonthYear(activeMonth)

  const { data, isLoading, error } = useSWR(
    () => `${getClientSideURL()}/api/events${dateQuery}`,
    fetcher
  )

  if (error || isLoading) return <DefaultList activeMonthString={activeMonthString} />

  const events = data.docs || []

  return (
    <ul>
      <li className="events-headline sticky p-1 md:p-2">
        <h6 className="text-base md:text-lg">{activeMonthString}</h6>
      </li>
      {events.length > 0 ? (
        events.map((e) => {
          const dateMatches = dateToNumeric(date) === dateToNumeric(e.startDate)
          return (
            <li
              key={e.id}
              className={`w-full list-none px-1 py-2 hover:bg-[var(--theme-highlight)] md:px-2 ${dateMatches ? 'bg-[var(--theme-highlight)]' : ''}`}
              onClick={() => {
                if (openEvent === e.id) {
                  setOpenEvent(null)
                } else {
                  setOpenEvent(e.id)
                }
                changeDate(new Date(e.startDate))
              }}
            >
              <h3 className="cursor-pointer text-xl md:text-2xl">
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
    </ul>
  )
}

export default CalendarEventList
