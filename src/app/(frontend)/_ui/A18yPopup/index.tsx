'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'
import { usePathname } from 'next/navigation'

const A18y = () => {
  const [openA18y, setA18y] = useState<boolean>(false)

  const clickButton = () => {
    setA18y(!openA18y)
  }

  return (
    <div className="col-span-full w-full">
      <A18yButton onClick={clickButton} status={openA18y} />
      <A18yModal onClick={clickButton} status={openA18y} />
    </div>
  )
}

const A18yModal = (props: { onClick: React.ReactEventHandler; status: boolean }) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const { status, onClick } = props

  const [options, setOptions] = useState({
    contrast: false,
    dark: false,
  })

  useEffect(() => {
    const a18y = localStorage.getItem('gladwell-a18y')
    if (a18y) {
      setOptions(JSON.parse(a18y))
    }
  }, [])

  useEffect(() => {
    const { contrast, dark } = options

    if (contrast) {
      setTheme('contrast')
    }

    if (dark) {
      setTheme('dark')
    }

    localStorage.setItem('gladwell-a18y', JSON.stringify(options))
  }, [options, setTheme])

  const handleToggle: React.ReactEventHandler = ({ target }) => {
    // @ts-expect-error name doesn't exist
    setOptions((s) => ({ ...s, [target.name]: !s[target.name] }))
  }

  return (
    <>
      {status && (
        <div className="form fixed right-4 bottom-4 w-[33%] rounded-md bg-(--theme-bg) p-2 text-base shadow-md">
          <button
            aria-label="close accessibility options modal"
            className="absolute top-2 right-2 cursor-pointer text-sm"
            onClick={onClick}
          >
            close
          </button>
          <h2 className="text-base">Accessibility Options</h2>
          <input
            type="checkbox"
            id="contrast"
            checked={options['contrast']}
            name="contrast"
            onChange={handleToggle}
          />
          <label htmlFor="contrast">High Contrast Mode</label>
          <br />
          <input
            type="checkbox"
            id="dark"
            name="dark"
            checked={options['dark']}
            onChange={handleToggle}
          />
          <label htmlFor="dark">Dark Mode</label>
        </div>
      )}
    </>
  )
}

const A18yButton = (props: { onClick: React.ReactEventHandler; status: boolean }) => {
  const { onClick, status } = props

  return (
    <button className="cursor-pointer py-1 text-left text-sm" onClick={onClick}>
      Accessibility Options
    </button>
  )
}

export default A18y
