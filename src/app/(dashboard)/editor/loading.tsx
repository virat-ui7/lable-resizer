import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function EditorLoading() {
  return (
    <div className="flex h-screen bg-[var(--color-bg-secondary)]">
      {/* Toolbar Skeleton */}
      <div className="w-64 border-r border-[var(--color-border-primary)] bg-white p-4">
        <Skeleton variant="text" width="100px" height="24px" className="mb-4" />
        <div className="space-y-2 mb-6">
          <Skeleton variant="rectangle" width="100%" height="40px" />
          <Skeleton variant="rectangle" width="100%" height="40px" />
          <Skeleton variant="rectangle" width="100%" height="40px" />
          <Skeleton variant="rectangle" width="100%" height="40px" />
        </div>
        <Skeleton variant="text" width="80px" height="20px" className="mb-4" />
        <div className="space-y-2">
          <Skeleton variant="rectangle" width="100%" height="32px" />
          <Skeleton variant="rectangle" width="100%" height="32px" />
        </div>
      </div>

      {/* Canvas Area Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-[var(--color-border-primary)] bg-white flex items-center gap-4 px-4">
          <Skeleton variant="rectangle" width="120px" height="32px" />
          <Skeleton variant="rectangle" width="100px" height="32px" />
          <Skeleton variant="rectangle" width="80px" height="32px" />
          <div className="ml-auto flex gap-2">
            <Skeleton variant="circle" width="32px" height="32px" />
            <Skeleton variant="circle" width="32px" height="32px" />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-lg">
            <Skeleton variant="rectangle" width="576px" height="432px" />
          </div>
        </div>
      </div>

      {/* Properties Panel Skeleton */}
      <div className="w-80 border-l border-[var(--color-border-primary)] bg-white p-4">
        <Skeleton variant="text" width="120px" height="24px" className="mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton variant="text" width="80px" height="14px" className="mb-2" />
            <Skeleton variant="rectangle" width="100%" height="32px" />
          </div>
          <div>
            <Skeleton variant="text" width="80px" height="14px" className="mb-2" />
            <Skeleton variant="rectangle" width="100%" height="32px" />
          </div>
          <div>
            <Skeleton variant="text" width="80px" height="14px" className="mb-2" />
            <Skeleton variant="rectangle" width="100%" height="80px" />
          </div>
        </div>
      </div>
    </div>
  )
}