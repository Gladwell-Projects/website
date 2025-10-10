'use client'

import { useContext, useDeferredValue, useState } from 'react'
import Modal, { ModalItem } from '../Modal'
import CalendarModal from './CalendarModal'
import CalendarEventList from './EventsList'
import { CalendarContext } from '../../_contexts/CalendarOpen'
import { Value } from 'react-calendar/dist/shared/types.js'

const CalendarPopup = () => {
  const [date, changeDate] = useState<Value>(new Date())
  const [calOpen, setCalOpen] = useContext(CalendarContext)
  const [activeMonth, setActiveMonth] = useState<Date>(new Date())
  const deferredActiveMonth = useDeferredValue(activeMonth)
  return (
    <Modal isActive={calOpen}>
      <button
        onClick={() => setCalOpen(false)}
        className="modal--item sticky top-0 right-0 z-99 col-span-4 col-start-5 row-start-1 block w-full cursor-pointer p-1 text-xs lg:col-span-1 lg:col-start-12 lg:p-1 lg:text-sm"
      >
        Close
      </button>
      <ModalItem
        className={`top-0 col-span-full md:sticky md:col-span-6 md:col-start-1 lg:col-span-5 lg:row-start-1 xl:col-span-4`}
      >
        <CalendarModal
          date={date}
          changeDate={changeDate}
          activeMonth={deferredActiveMonth}
          setActiveMonth={setActiveMonth}
        />
      </ModalItem>
      <ModalItem
        className={`event-list modal--item col-span-full p-0 md:sticky md:col-span-6 lg:col-span-6 lg:row-start-1 xl:col-span-7`}
      >
        <CalendarEventList
          date={date}
          changeDate={changeDate}
          activeMonth={deferredActiveMonth}
          setActiveMonth={setActiveMonth}
        />
      </ModalItem>
    </Modal>
  )
}

export default CalendarPopup
