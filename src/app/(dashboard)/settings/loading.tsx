import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="text" width="200px" height="32px" className="mb-2" />
        <Skeleton variant="text" width="300px" height="20px" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 mb-6 border-b border-[var(--color-border-primary)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangle" width="100px" height="40px" className="mb-0" />
        ))}
      </div>

      {/* Settings Content Skeleton */}
      <Card>
        <Card.Body>
          <div className="space-y-6">
            {/* Section Skeleton */}
            <div>
              <Skeleton variant="text" width="150px" height="20px" className="mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton variant="text" width="100px" height="14px" className="mb-2" />
                  <Skeleton variant="rectangle" width="100%" height="40px" />
                </div>
                <div>
                  <Skeleton variant="text" width="100px" height="14px" className="mb-2" />
                  <Skeleton variant="rectangle" width="100%" height="40px" />
                </div>
                <div>
                  <Skeleton variant="text" width="100px" height="14px" className="mb-2" />
                  <Skeleton variant="rectangle" width="100%" height="40px" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[var(--color-border-primary)]">
              <Skeleton variant="rectangle" width="120px" height="40px" />
              <Skeleton variant="rectangle" width="100px" height="40px" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}