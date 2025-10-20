'use client'
import { getClientSideURL } from '@/utilities/getURL'
import Calendar, { TileClassNameFunc } from 'react-calendar'
import { OnArgs } from 'react-calendar/dist/shared/types.js'
import useSWR from 'swr'
import { fetcher, query } from './getEvents'
import { Suspense } from 'react'
import { dateToNumeric } from '../../../../utilities/convertCMSDate'
import { fetchCollection } from '../../_data'

const CalendarModal = (props: {
  date: Date
  changeDate: (value: Date, event?: React.MouseEvent<HTMLButtonElement>) => void
  activeMonth: Date
  setActiveMonth?: (date: Date | null) => void
}) => {
  const { date, changeDate, activeMonth, setActiveMonth } = props

  const dateQuery = query(activeMonth.toString())

  const { data, isLoading, error } = useSWR(
    () => `${getClientSideURL()}/api/events${dateQuery}`,
    fetcher
  )

  if (error) return 'sorry there was an error finding that information'
  if (isLoading) {
    return (
      <>
        <Calendar
          value={null}
          onChange={null}
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
      </>
    )
  }

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

      return (
        datesWithEvents.find((x) => dateToNumeric(x) === dateToNumeric(date)) &&
        'hasEvent'
      )
    }
    return null
  }

  return (
    <>
      {error && !isLoading && 'there was an error loading the calendar dates...'}
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
    </>
  )
}

export default CalendarModal
