'use client'

import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'
import A11yIcon from './Accessibility.svg'
import A11yContext from '../../_contexts/A11yContext'

const A11y = () => {
  const [openA11y, setOpenA11y] = useState<boolean>(false)

  const [a11y, setA11y] = useContext(A11yContext)

  const clickButton = () => {
    setOpenA11y(!openA11y)
  }

  return (
    <div className={`col-span-full w-full`}>
      <A11yButton onClick={clickButton} status={openA11y} />
      <A11yModal a11y={a11y} setA11y={setA11y} onClick={clickButton} status={openA11y} />
    </div>
  )
}

const A11yModal = (props: {
  onClick: React.ReactEventHandler
  status: boolean
  a11y: string
  setA11y: Dispatch<SetStateAction<string>>
}) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const firstUpdate = useRef(true)

  const { status, onClick, a11y, setA11y } = props

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (!a11y) {
      localStorage.removeItem('gladwell-a11y')
      return
    }
    localStorage.setItem('gladwell-a11y', a11y)
  }, [a11y])

  // @ts-expect-error name doesn't exist
  const handleToggle: React.ReactEventHandler = ({ target: { name } }) => {
    setA11y(name === a11y ? null : name)

    if (name === a11y) {
      setTheme({ ...theme, current: theme.default })
      return
    }

    setTheme({ ...theme, current: name })
  }

  return (
    <>
      {status && (
        <div className="form fixed right-4 bottom-4 left-4 border-2 border-(--theme-text) bg-(--theme-bg) p-2 text-base shadow-md md:left-auto md:w-[50%] lg:w-[33%]">
          <button
            aria-label="close accessibility a11ys modal"
            className="absolute top-2 right-2 cursor-pointer text-sm"
            onClick={onClick}
          >
            close
          </button>
          <h2 className="text-base">Accessibility Options</h2>
          <input
            type="checkbox"
            id="contrast"
            checked={a11y === 'contrast'}
            name="contrast"
            onChange={handleToggle}
          />
          <label htmlFor="contrast">High Contrast Mode</label>
          <br />
          <input
            type="checkbox"
            id="dark"
            name="dark"
            checked={a11y === 'dark'}
            onChange={handleToggle}
          />
          <label htmlFor="dark">Dark Mode</label>
        </div>
      )}
    </>
  )
}

const A11yButton = (props: { onClick: React.ReactEventHandler; status: boolean }) => {
  const { onClick, status } = props

  return (
    <button
      className={`fixed right-2 bottom-2 cursor-pointer text-left text-sm transition-all ${status ? 'right-6 bottom-6 z-99' : ''}`}
      onClick={onClick}
      tabIndex={1}
      aria-label={`${status ? 'Close' : 'Open'} the Accessibility Options Panel`}
    >
      <A11yIcon
        className="overflow-visible fill-(--theme-text) stroke-(--theme-bg) stroke-6 [paint-order:stroke]"
        width="50"
        alt="accessibility a11ys button"
        height="50"
      />
    </button>
  )
}

export default A11y
