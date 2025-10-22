'use client'

import { useEffect, useState } from 'react'

const CursorSpotlight = () => {
  const [isTouch, setIsTouch] = useState<boolean | null>(null)
  const [x, setX] = useState<number>(null)
  const [y, setY] = useState<number>(null)

  const handleMouseMove = (e: MouseEvent) => {
    setX(e.pageX)
    setY(e.pageY)
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
      window.addEventListener('mousemove', handleMouseMove)
    }
    if (isTouch) {
      window.addEventListener('touchmove', handleTouchMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="spotlight h-[25vw] w-[25vw] shadow-[inset_0_0_4vw_6vw_black] md:h-[10vw] md:w-[10vw] md:shadow-[inset_0_0_1vw_3vw_black]"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  )
}

export default CursorSpotlight
