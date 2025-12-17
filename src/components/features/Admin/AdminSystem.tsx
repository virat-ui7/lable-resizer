'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { CheckCircle2, XCircle, AlertCircle, Database, Server, Activity } from 'lucide-react'

interface SystemStatus {
  database: 'healthy' | 'degraded' | 'down'
  api: 'healthy' | 'degraded' | 'down'
  storage: 'healthy' | 'degraded' | 'down'
  response_time_ms: number
  last_check: string
}

/**
 * AdminSystem component - system status monitoring
 */
export const AdminSystem: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSystemStatus()
    // Refresh every 30 seconds
    const interval = setInterval(loadSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system/status')
      if (!response.ok) throw new Error('Failed to load system status')

      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Load system status error:', error)
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

  if (!status) {
    return <div>Failed to load system status</div>
  }

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return <CheckCircle2 size={24} className="text-green-600" />
      case 'degraded':
        return <AlertCircle size={24} className="text-yellow-600" />
      case 'down':
        return <XCircle size={24} className="text-red-600" />
      default:
        return <AlertCircle size={24} className="text-gray-600" />
    }
  }

  const getStatusBadge = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>
      case 'down':
        return <Badge variant="error">Down</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database size={24} className="text-blue-600" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Database</h3>
              </div>
              {getStatusIcon(status.database)}
            </div>
            {getStatusBadge(status.database)}
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Server size={24} className="text-purple-600" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">API</h3>
              </div>
              {getStatusIcon(status.api)}
            </div>
            {getStatusBadge(status.api)}
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={24} className="text-green-600" />
                <h3 className="font-semibold text-[var(--color-text-primary)]">Storage</h3>
              </div>
              {getStatusIcon(status.storage)}
            </div>
            {getStatusBadge(status.storage)}
          </Card.Body>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Performance Metrics
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Average Response Time</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                {status.response_time_ms}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Last Check</span>
              <span className="text-sm text-[var(--color-text-primary)]">
                {new Date(status.last_check).toLocaleString()}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminSystem

