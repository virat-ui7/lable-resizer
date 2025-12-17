import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'

export default function TemplatesLoading() {
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

      {/* Template Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <Card.Body>
              {/* Template Preview Skeleton */}
              <Skeleton variant="rectangle" width="100%" height="200px" className="mb-4 rounded" />
              
              {/* Template Info */}
              <div className="space-y-2">
                <Skeleton variant="text" width="70%" height="20px" />
                <Skeleton variant="text" width="50%" height="16px" />
                <div className="flex items-center gap-2 mt-4">
                  <Skeleton variant="rectangle" width="60px" height="24px" />
                  <Skeleton variant="rectangle" width="60px" height="24px" />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}