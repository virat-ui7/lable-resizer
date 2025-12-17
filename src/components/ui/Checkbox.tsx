'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  indeterminate?: boolean
}

/**
 * Checkbox component
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate])

    return (
      <div className="flex flex-col">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            ref={inputRef}
            className={cn(
              'w-4 h-4 rounded border-[var(--color-border-primary)]',
              'text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]',
              'focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error-500)]',
              className
            )}
            {...props}
          />
          {label && (
            <span
              className={cn(
                'text-sm text-[var(--color-text-primary)]',
                props.disabled && 'opacity-50',
                error && 'text-[var(--color-error-500)]'
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error-500)]">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
