'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

/**
 * Tooltip component
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const tooltipHeight = 32
        const tooltipWidth = 120
        const spacing = 8

        let x = 0
        let y = 0

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2
            y = rect.top - tooltipHeight - spacing
            break
          case 'bottom':
            x = rect.left + rect.width / 2
            y = rect.bottom + spacing
            break
          case 'left':
            x = rect.left - tooltipWidth - spacing
            y = rect.top + rect.height / 2
            break
          case 'right':
            x = rect.right + spacing
            y = rect.top + rect.height / 2
            break
        }

        setCoords({ x, y })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof window !== 'undefined' &&
        isVisible &&
        createPortal(
          <div
            className={cn(
              'fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none',
              positionClasses[position],
              className
            )}
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
            }}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-0 h-0 border-4 border-transparent',
                position === 'top' && 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
                position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
                position === 'left' && 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
                position === 'right' && 'right-full top-1/2 -translate-y-1/2 border-r-gray-900'
              )}
            />
          </div>,
          document.body
        )}
    </>
  )
}

export default Tooltip
