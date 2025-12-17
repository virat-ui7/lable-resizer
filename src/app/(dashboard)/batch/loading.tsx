import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function BatchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="text" width="250px" height="32px" className="mb-2" />
        <Skeleton variant="text" width="400px" height="20px" />
      </div>

      {/* Step Indicator Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <Skeleton variant="circle" width="40px" height="40px" />
                <div className="ml-2 hidden md:block">
                  <Skeleton variant="text" width="80px" height="16px" />
                </div>
              </div>
              {index < 3 && (
                <Skeleton variant="rectangle" width="100px" height="2px" className="mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Wizard Content Skeleton */}
      <Card>
        <Card.Body>
          <div className="space-y-6">
            <div>
              <Skeleton variant="text" width="150px" height="20px" className="mb-4" />
              <div className="space-y-3">
                <Skeleton variant="rectangle" width="100%" height="48px" />
                <Skeleton variant="rectangle" width="100%" height="48px" />
                <Skeleton variant="rectangle" width="100%" height="48px" />
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--color-border-primary)]">
              <div className="flex justify-between">
                <Skeleton variant="rectangle" width="100px" height="40px" />
                <Skeleton variant="rectangle" width="120px" height="40px" />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}