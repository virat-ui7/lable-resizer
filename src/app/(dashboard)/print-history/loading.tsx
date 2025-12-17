import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function PrintHistoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="text" width="250px" height="32px" className="mb-2" />
        <Skeleton variant="text" width="300px" height="20px" />
      </div>

      {/* Print History Table Skeleton */}
      <Card>
        <Card.Body>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-5 gap-4 pb-4 border-b border-[var(--color-border-primary)] mb-4">
            {['Date', 'Printer', 'Labels', 'Status', 'Actions'].map((header, i) => (
              <Skeleton key={i} variant="text" width="100px" height="16px" />
            ))}
          </div>

          {/* Table Rows */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-4 border-b border-[var(--color-border-primary)] last:border-0"
              >
                <div>
                  <Skeleton variant="text" width="120px" height="16px" />
                  <Skeleton variant="text" width="80px" height="14px" className="mt-1" />
                </div>
                <Skeleton variant="text" width="150px" height="16px" />
                <Skeleton variant="text" width="60px" height="16px" />
                <Skeleton variant="rectangle" width="80px" height="24px" />
                <Skeleton variant="rectangle" width="100px" height="32px" />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}