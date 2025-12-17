'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Users, DollarSign, TrendingUp, Activity, FileText, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface DashboardStats {
  total_users: number
  active_users_today: number
  total_revenue: number
  monthly_revenue: number
  total_labels: number
  total_batches: number
  user_growth: {
    this_month: number
    last_month: number
    growth_percent: number
  }
  recent_activity: Array<{
    id: string
    type: string
    description: string
    created_at: string
  }>
}

/**
 * AdminDashboard component - overview of system metrics
 */
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('Failed to load stats')

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Load dashboard stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load dashboard stats</div>
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Total Users</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                  {stats.total_users.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.user_growth.this_month} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Active Today</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                  {stats.active_users_today.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                  ${stats.monthly_revenue.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">MRR</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Labels Created</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                  {stats.total_labels.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText size={24} className="text-orange-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              User Growth
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">This Month</span>
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                  +{stats.user_growth.this_month}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Last Month</span>
                <span className="text-xl text-[var(--color-text-primary)]">
                  {stats.user_growth.last_month}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-primary)]">
                <span className="text-[var(--color-text-secondary)]">Growth Rate</span>
                <span
                  className={`text-xl font-bold ${
                    stats.user_growth.growth_percent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stats.user_growth.growth_percent >= 0 ? '+' : ''}
                  {stats.user_growth.growth_percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Usage Statistics
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Total Labels</span>
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.total_labels.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Batch Jobs</span>
                <span className="text-xl text-[var(--color-text-primary)]">
                  {stats.total_batches.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-primary)]">
                <span className="text-[var(--color-text-secondary)]">Total Revenue</span>
                <span className="text-xl font-bold text-[var(--color-text-primary)]">
                  ${stats.total_revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Recent Activity
          </h3>
        </Card.Header>
        <Card.Body>
          {stats.recent_activity.length === 0 ? (
            <p className="text-[var(--color-text-secondary)] text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recent_activity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border border-[var(--color-border-primary)] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {activity.description}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminDashboard

