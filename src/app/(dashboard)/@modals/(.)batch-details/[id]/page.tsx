'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/Dialog'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { X, Download, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function BatchDetailsModal() {
  const params = useParams()
  const router = useRouter()
  const batchId = params.id as string
  const [batch, setBatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBatch() {
      try {
        setLoading(true)
        const response = await fetch(`/api/batch/${batchId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.error || 'Failed to load batch job')
          return
        }

        setBatch(data.data)
      } catch (err) {
        console.error('Error fetching batch:', err)
        setError('Failed to load batch details')
      } finally {
        setLoading(false)
      }
    }

    if (batchId) {
      fetchBatch()
    }
  }, [batchId])

  const handleClose = () => {
    router.back()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />
      case 'failed':
        return <XCircle className="text-red-600" size={20} />
      case 'processing':
        return <RefreshCw className="text-yellow-600 animate-spin" size={20} />
      case 'pending':
        return <Clock className="text-blue-600" size={20} />
      default:
        return <AlertCircle className="text-gray-600" size={20} />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
      completed: 'success',
      failed: 'error',
      processing: 'warning',
      pending: 'info',
    }
    return variants[status] || 'info'
  }

  return (
    <Dialog open={true} onClose={handleClose} size="lg">
      <Card>
        <Card.Header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Batch Job #{batchId.slice(0, 8)}
              </h2>
              {batch && (
                <Badge variant={getStatusBadge(batch.status)} className="text-xs">
                  {getStatusIcon(batch.status)}
                  <span className="ml-1 capitalize">{batch.status}</span>
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={20} />
            </Button>
          </Card.Header>
          <Card.Body>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-[var(--color-error-500)] mb-4">{error}</p>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}

            {batch && !loading && !error && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Status
                    </p>
                    <Badge variant={getStatusBadge(batch.status)}>
                      {getStatusIcon(batch.status)}
                      <span className="ml-1 capitalize">{batch.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Total Labels
                    </p>
                    <p className="text-[var(--color-text-primary)] font-semibold">
                      {batch.total_labels || 0}
                    </p>
                  </div>
                </div>

                {batch.status === 'processing' && batch.generated_labels !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Progress
                    </p>
                    <p className="text-[var(--color-text-primary)]">
                      {batch.generated_labels} / {batch.total_labels} labels generated
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Created
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {format(new Date(batch.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  {batch.completed_at && (
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                        Completed
                      </p>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {format(new Date(batch.completed_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  )}
                </div>

                {batch.error_message && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800 mb-1">Error</p>
                    <p className="text-sm text-red-700">{batch.error_message}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                  {batch.status === 'completed' && batch.file_path && (
                    <Button
                      variant="primary"
                      onClick={() => window.open(`/api/batch/${batchId}/download`, '_blank')}
                    >
                      <Download size={18} className="mr-2" />
                      Download PDF
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => router.push(`/batch/${batchId}`)}>
                    View Full Details
                  </Button>
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            )}
        </Card.Body>
      </Card>
    </Dialog>
  )
}
