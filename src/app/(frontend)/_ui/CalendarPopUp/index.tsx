'use client'

import { useDeferredValue, useState } from 'react'
import { ModalItem } from '../Modal'
import CalendarModal from './CalendarModal'
import CalendarEventList from './EventsList'

const CalendarPopup = ({ hasClose }: { hasClose: boolean }) => {
  const [date, changeDate] = useState<Date>(new Date())
  const [activeMonth, setActiveMonth] = useState<Date>(new Date())
  const deferredActiveMonth = useDeferredValue(activeMonth)
  return (
    <>
      <ModalItem
        className={`top-2 col-span-full h-auto place-self-start p-1 transition-[height] md:sticky md:col-span-6 md:col-start-1 md:p-2 md:text-base lg:col-span-5 xl:col-span-4`}
      >
        <CalendarModal
          date={date}
          changeDate={changeDate}
          activeMonth={deferredActiveMonth}
          setActiveMonth={setActiveMonth}
        />
      </ModalItem>
      <ModalItem
        className={`event-list modal--item col-span-full w-full place-self-start p-0 transition-[height] ${hasClose ? 'mt-2 md:col-span-6 lg:col-span-6 xl:col-span-7' : 'md:col-span-6 lg:col-span-7 xl:col-span-8'}`}
      >
        <CalendarEventList
          date={date}
          changeDate={changeDate}
          activeMonth={deferredActiveMonth}
          setActiveMonth={setActiveMonth}
        />
      </ModalItem>
    </>
  )
}

export default CalendarPopup
