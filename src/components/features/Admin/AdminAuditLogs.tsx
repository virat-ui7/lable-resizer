'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  changes: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user_email?: string
}

/**
 * AdminAuditLogs component - view audit logs
 */
export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState<string>('all')

  useEffect(() => {
    loadAuditLogs()
  }, [filterAction])

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterAction !== 'all') {
        params.append('action', filterAction)
      }

      const response = await fetch(`/api/admin/logs?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load logs')

      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error('Load audit logs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.action.toLowerCase().includes(query) ||
        log.entity_type?.toLowerCase().includes(query) ||
        log.user_email?.toLowerCase().includes(query) ||
        log.ip_address?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-tertiary)]" size={20} />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-[var(--color-border-primary)] rounded-lg"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </Card.Body>
      </Card>

      {/* Logs Table */}
      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-primary)]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Entity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[var(--color-text-secondary)]">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-gray-50)]"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {format(new Date(log.created_at), 'MMM d, yyyy h:mm:ss a')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-text-primary)]">
                          {log.user_email || 'System'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {log.entity_type || 'N/A'}
                          {log.entity_id && (
                            <span className="text-xs text-[var(--color-text-tertiary)] ml-1">
                              ({log.entity_id.substring(0, 8)}...)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {log.ip_address || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminAuditLogs

