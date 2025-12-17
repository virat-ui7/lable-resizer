'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

/**
 * AdminAnalytics component - detailed analytics
 */
export const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load analytics data
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <Card.Body>
          <p className="text-[var(--color-text-secondary)]">
            Analytics dashboard coming soon. This will include charts, graphs, and detailed metrics.
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminAnalytics

