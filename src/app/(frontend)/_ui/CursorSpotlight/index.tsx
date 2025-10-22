'use client'

import { useEffect, useState } from 'react'

const CursorSpotlight = () => {
  const [isTouch, setIsTouch] = useState<boolean | null>(null)
  const [position, setPosition] = useState({ x: null, y: null })

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  const handleTouchMove = (event: TouchEvent) => {
    const { touches, changedTouches } = event
    const touch = touches[0] ?? changedTouches[0]
    setPosition({ x: touch.clientX, y: touch.clientY })
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
      id="spotlight"
      className="spotlight fixed h-[25vw] w-[25vw] shadow-[inset_0_0_4vw_6vw_black] md:h-[10vw] md:w-[10vw] md:shadow-[inset_0_0_1vw_3vw_black]"
      style={{ top: position.y, left: position.x }}
    ></div>
  )
}

export default CursorSpotlight
