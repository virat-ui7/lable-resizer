'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  children: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Card component with header, body, and footer sections
 * Follows design system specifications
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-[var(--color-border-primary)] shadow-sm',
      elevated: 'bg-white border border-[var(--color-border-primary)] shadow-lg',
      bordered: 'bg-[var(--color-gray-50)] border border-[var(--color-border-secondary)]',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-shadow duration-200',
          'hover:shadow-md',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardBody.displayName = 'CardBody'

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-[var(--color-border-primary)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

// Compound component pattern - assign properties directly to Card
// Object.assign mutates Card, so we assign then export Card directly
Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

// Ensure properties are directly on Card (backup assignment)
;(Card as any).Header = CardHeader
;(Card as any).Body = CardBody
;(Card as any).Footer = CardFooter

// Create a type-safe reference for export
const CardWithSubcomponents = Card as typeof Card & {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
}


export { CardWithSubcomponents as Card, CardHeader, CardBody, CardFooter }
export default CardWithSubcomponents

