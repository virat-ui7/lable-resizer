'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default'
  children: React.ReactNode
}

/**
 * Badge component for status indicators
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-gray-100)] text-[var(--color-gray-800)]',
      success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)]',
      error: 'bg-[var(--color-error-50)] text-[var(--color-error-700)]',
      warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)]',
      info: 'bg-[var(--color-info-50)] text-[var(--color-info-700)]',
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge

