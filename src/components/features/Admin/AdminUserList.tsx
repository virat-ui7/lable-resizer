'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { 
  Search, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Crown,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/Toast'

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  subscription_tier: 'free' | 'pro' | 'enterprise'
  subscription_status: string
  is_admin: boolean
  created_at: string
  labels_used_this_month: number
  batches_used_this_month: number
}

/**
 * AdminUserList component - manage all users
 */
export const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [filterTier])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterTier !== 'all') {
        params.append('tier', filterTier)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load users')

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Load users error:', error)
      showToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update user')

      showToast('User updated successfully', 'success')
      loadUsers()
      setShowEditModal(false)
    } catch (error) {
      console.error('Update user error:', error)
      showToast('Failed to update user', 'error')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete user')

      showToast('User deleted successfully', 'success')
      loadUsers()
    } catch (error) {
      console.error('Delete user error:', error)
      showToast('Failed to delete user', 'error')
    }
  }

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.email.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      )
    }
    return true
  })

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
                  placeholder="Search by email, name, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as any)}
              className="px-4 py-2 border border-[var(--color-border-primary)] rounded-lg"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-primary)]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Usage
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[var(--color-text-secondary)]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-gray-50)]"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {user.is_admin ? (
                              <Shield size={20} className="text-purple-600" />
                            ) : (
                              <User size={20} className="text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">
                              {user.full_name || 'No name'}
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded capitalize ${
                            user.subscription_tier === 'enterprise'
                              ? 'bg-purple-100 text-purple-600'
                              : user.subscription_tier === 'pro'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.subscription_tier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          <div>{user.labels_used_this_month} labels</div>
                          <div>{user.batches_used_this_month} batches</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            user.subscription_status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.subscription_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  )
}

/**
 * Edit User Modal Component
 */
const EditUserModal: React.FC<{
  user: AdminUser
  onClose: () => void
  onUpdate: (userId: string, updates: Partial<AdminUser>) => Promise<void>
}> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    subscription_tier: user.subscription_tier,
    subscription_status: user.subscription_status,
    is_admin: user.is_admin,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onUpdate(user.id, formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <Card.Header>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Edit User: {user.email}
          </h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Subscription Tier
              </label>
              <select
                value={formData.subscription_tier}
                onChange={(e) =>
                  setFormData({ ...formData, subscription_tier: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Subscription Status
              </label>
              <select
                value={formData.subscription_status}
                onChange={(e) =>
                  setFormData({ ...formData, subscription_status: e.target.value })
                }
                className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg"
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="paused">Paused</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_admin"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_admin" className="text-sm font-medium text-[var(--color-text-primary)]">
                Admin Access
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading} className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminUserList

