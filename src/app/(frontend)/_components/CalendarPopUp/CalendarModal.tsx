'use client'
import { getClientSideURL } from '@/utilities/getURL'
import Calendar, { TileClassNameFunc } from 'react-calendar'
import { OnArgs, Value } from 'react-calendar/dist/shared/types.js'
import useSWR from 'swr'
import { fetcher, query } from './getEvents'
import { Suspense } from 'react'

const CalendarModal = (props: {
  date: Value
  changeDate: (
    value: Value,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void
  activeMonth: Date
  setActiveMonth?: (date: Date | null) => void
}) => {
  const { date, changeDate, activeMonth, setActiveMonth } = props

  const dateQuery = query(activeMonth.toString())

  const { data, isLoading, error } = useSWR(
    () => `${getClientSideURL()}/api/events${dateQuery}`,
    fetcher,
    { suspense: true }
  )

  const handleActiveStartDateChange = ({ view, activeStartDate }: OnArgs) => {
    setActiveMonth(activeStartDate)
    if (view === 'month') {
      changeDate(activeStartDate)
    }
  }

  //@ts-expect-error value
  const handleCalendarChange = (value) => {
    changeDate(value)
  }

  const activeDates: TileClassNameFunc = ({ date, view }) => {
    if (view === 'month') {
      const selectedMonth = date.getMonth()
      // console.log(selectedMonth)
      const datesWithEvents = data.docs
        .filter((e) => {
          const eventMonth = new Date(e.startDate).getMonth()
          return eventMonth === selectedMonth
        })
        .map((e) => {
          return new Date(e.startDate)
        })

      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        year: 'numeric',
        day: 'numeric',
        month: 'numeric',
      }

      return (
        datesWithEvents.find(
          (x) =>
            x.toLocaleDateString('en-US', dateOptions) ===
            date.toLocaleDateString('en-US', dateOptions)
        ) && 'hasEvent'
      )
    }
    return null
  }

  return (
    <>
      {error &&
        !isLoading &&
        'there was an error loading the calendar dates...'}
      <Suspense
        fallback={
          <Calendar
            maxDetail="month"
            minDetail="year"
            nextLabel="→"
            prevLabel="←"
            next2Label={null}
            prev2Label={null}
            calendarType="gregory"
            showNeighboringMonth={false}
            activeStartDate={activeMonth}
          />
        }
      >
        {!isLoading && !error && (
          <Calendar
            value={date}
            onChange={handleCalendarChange}
            maxDetail="month"
            minDetail="year"
            nextLabel="→"
            prevLabel="←"
            next2Label={null}
            prev2Label={null}
            calendarType="gregory"
            tileClassName={activeDates}
            showNeighboringMonth={false}
            activeStartDate={activeMonth}
            onActiveStartDateChange={handleActiveStartDateChange}
          />
        )}
      </Suspense>
    </>
  )
}

export default CalendarModal
