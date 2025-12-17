'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

/**
 * Toggle switch component
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, className, checked, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              checked={checked}
              {...props}
            />
            <div
              className={cn(
                "w-11 h-6 rounded-full peer",
                "bg-[var(--color-gray-300)]",
                "peer-checked:bg-[var(--color-primary-500)]",
                "peer-focus:ring-2 peer-focus:ring-[var(--color-primary-500)] peer-focus:ring-offset-2",
                "transition-colors duration-200",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                error && "peer-checked:bg-[var(--color-error-500)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform duration-200",
                  "peer-checked:translate-x-5"
                )}
              />
            </div>
          </div>
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

Switch.displayName = 'Switch'

export default Switch
