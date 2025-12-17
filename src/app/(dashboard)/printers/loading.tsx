import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function PrintersLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton variant="text" width="200px" height="32px" className="mb-2" />
          <Skeleton variant="text" width="300px" height="20px" />
        </div>
        <Skeleton variant="rectangle" width="150px" height="40px" />
      </div>

      {/* Printer Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <Card.Body>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" height="24px" className="mb-2" />
                  <Skeleton variant="text" width="50%" height="16px" />
                </div>
                <Skeleton variant="circle" width="40px" height="40px" />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width="80px" height="14px" />
                  <Skeleton variant="text" width="100px" height="14px" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width="80px" height="14px" />
                  <Skeleton variant="text" width="100px" height="14px" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width="80px" height="14px" />
                  <Skeleton variant="rectangle" width="60px" height="20px" />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[var(--color-border-primary)]">
                <Skeleton variant="rectangle" width="80px" height="32px" />
                <Skeleton variant="rectangle" width="80px" height="32px" />
                <Skeleton variant="rectangle" width="80px" height="32px" />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}