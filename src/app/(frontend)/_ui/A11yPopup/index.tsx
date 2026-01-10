/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import ThemeContext from '../../_contexts/ThemeContext'
import A11yIcon from './Accessibility.svg'
import A11yContext from '../../_contexts/A11yContext'
import { usePathname } from 'next/navigation'

const A11y = () => {
  const [openA11y, setOpenA11y] = useState<boolean>(false)

  const [a11y, setA11y] = useContext(A11yContext)

  const [hidden, setHidden] = useState<boolean>(false)

  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const hiddenStored = localStorage.getItem('gladwell-a11y-hidden')
    if (hiddenStored) {
      setHidden(hiddenStored === 'true' ? true : false)
      return
    }
    setHidden(false)
  }, [])

  const clickButton = () => {
    setOpenA11y(!openA11y)
  }

  return (
    <>
      {!isHomePage && (
        <div className={`col-span-full w-full`}>
          <A11yButton onClick={clickButton} status={openA11y} hidden={hidden} />
          <A11yModal
            hidden={hidden}
            setHidden={setHidden}
            a11y={a11y}
            setA11y={setA11y}
            onClick={clickButton}
            status={openA11y}
          />
        </div>
      )}
    </>
  )
}

const A11yModal = (props: {
  onClick: React.ReactEventHandler
  status: boolean
  a11y: any
  setA11y: Dispatch<SetStateAction<any>>
  hidden: boolean
  setHidden: Dispatch<SetStateAction<boolean>>
}) => {
  const [theme, setTheme] = useContext(ThemeContext)

  const firstUpdate = useRef(true)

  const firstHiddenUpdate = useRef(true)

  const { status, onClick, a11y, setA11y, hidden, setHidden } = props

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    if (!a11y) {
      localStorage.removeItem('gladwell-a11y')
      return
    }
    localStorage.setItem('gladwell-a11y', JSON.stringify(a11y))
  }, [a11y])

  useEffect(() => {
    if (firstHiddenUpdate.current) {
      firstHiddenUpdate.current = false
      return
    }
    localStorage.setItem('gladwell-a11y-hidden', hidden.toString())
  }, [hidden])

  // @ts-expect-error name doesn't exist
  const handleToggle: React.ReactEventHandler = ({ target: { name, id } }) => {
    if (a11y[name] === id) {
      setA11y({ ...a11y, [name]: null })
    } else {
      setA11y({ ...a11y, [name]: id })
    }
    if (name === 'theme' && id === a11y.theme) {
      setTheme({ ...theme, current: theme.default })
    } else if (name === 'theme') {
      setTheme({ ...theme, current: id })
    }
  }

  const handleHide = () => {
    setHidden(!hidden)
  }

  return (
    <div
      aria-hidden={!status}
      className={`fixed right-4 bottom-4 left-4 z-999 origin-bottom-right transition-all duration-200 md:left-[50%] ${status ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
    >
      <div className="modal--item accessibilityModal form p-2 text-xl [&_label]:text-lg">
        <button
          aria-label="close accessibility a11ys modal"
          className="absolute top-2 right-2 cursor-pointer text-sm"
          onClick={onClick}
        >
          CLOSE
        </button>
        <h2 className="text-base">Accessibility Options</h2>
        <div className="pb-1">
          <div>
            <input
              type="checkbox"
              id="contrast"
              checked={a11y.theme === 'contrast'}
              name="theme"
              onChange={handleToggle}
            />
            <label htmlFor="contrast">Increase Contrast</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="dark"
              name="theme"
              checked={a11y.theme === 'dark'}
              onChange={handleToggle}
            />
            <label htmlFor="dark">Dark Background</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="textLarge"
              name="text"
              checked={a11y.text === 'textLarge'}
              onChange={handleToggle}
            />
            <label htmlFor="textLarge">Bigger Text</label>
          </div>
        </div>
        <div>
          <h3 className="text-base">Other Options</h3>
          <input
            className="text-base"
            type="checkbox"
            id="hide"
            name="hide"
            checked={hidden}
            onChange={handleHide}
          />
          <label htmlFor="hide" className="text-base!">
            Pin accessibility options to the site footer
          </label>
        </div>
      </div>
    </div>
  )
}

const A11yButton = (props: {
  hidden: boolean
  onClick: React.ReactEventHandler
  status: boolean
}) => {
  const { onClick, status, hidden } = props

  return (
    <button
      className={`${hidden ? 'absolute' : `fixed`} right-2 bottom-2 z-999 cursor-pointer text-left text-sm transition-all ${status ? 'right-6 bottom-6' : ''}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={`${status ? 'Close' : 'Open'} the Accessibility Options Panel`}
    >
      <A11yIcon
        className="overflow-visible fill-(--theme-text) stroke-(--theme-bg) stroke-6 [paint-order:stroke]"
        width="50"
        alt="accessibility button icon"
        height="50"
        aria-label="Accessibility Icon"
      />
    </button>
  )
}

export default A11y
