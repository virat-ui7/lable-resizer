import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton variant="text" width="300px" height="32px" className="mb-2" />
          <Skeleton variant="text" width="200px" height="20px" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton variant="text" width="120px" height="16px" className="mb-2" />
                    <Skeleton variant="text" width="60px" height="36px" className="mb-2" />
                    <Skeleton variant="text" width="80px" height="14px" />
                  </div>
                  <Skeleton variant="circle" width="48px" height="48px" />
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Skeleton variant="text" width="150px" height="24px" />
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton variant="circle" width="40px" height="40px" />
                    <div className="flex-1">
                      <Skeleton variant="text" width="70%" height="16px" className="mb-2" />
                      <Skeleton variant="text" width="50%" height="14px" />
                    </div>
                    <Skeleton variant="text" width="80px" height="14px" />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Skeleton variant="text" width="150px" height="24px" />
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton variant="text" width="60%" height="16px" className="mb-2" />
                    <Skeleton variant="text" width="100%" height="12px" className="mb-1" />
                    <Skeleton variant="text" width="80%" height="12px" />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}