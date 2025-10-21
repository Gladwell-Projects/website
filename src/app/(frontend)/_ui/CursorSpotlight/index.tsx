'use client'

import { useEffect, useState } from 'react'

const CursorSpotlight = () => {
  const [isTouch, setIsTouch] = useState<boolean | null>(null)
  const [x, setX] = useState<number>(null)
  const [y, setY] = useState<number>(null)

  const handleMouseMove = (e: MouseEvent) => {
    setX(e.pageX)
    setY(e.pageY)

    console.log('mouse moving')
  }

  const handleTouchMove = (event: TouchEvent) => {
    const { touches, changedTouches } = event
    const touch = touches[0] ?? changedTouches[0]
    setX(touch.pageX)
    setY(touch.pageY)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
  }, [])

  useEffect(() => {
    if (!isTouch) {
      console.log('not a touch!')
      window.addEventListener('mousemove', handleMouseMove)
    }
    if (isTouch) {
      console.log('touch!')
      window.addEventListener('touchmove', handleTouchMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="spotlight" style={{ left: `${x}px`, top: `${y}px` }}></div>
}

export default CursorSpotlight
