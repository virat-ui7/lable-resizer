'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/Dialog'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { X, Eye, Download } from 'lucide-react'
import { format } from 'date-fns'

export default function TemplateDetailsModal() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true)
        const response = await fetch(`/api/templates/${templateId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.error || 'Failed to load template')
          return
        }

        setTemplate(data.data)
      } catch (err) {
        console.error('Error fetching template:', err)
        setError('Failed to load template details')
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      fetchTemplate()
    }
  }, [templateId])

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open={true} onClose={handleClose} size="lg">
      <Card>
        <Card.Header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {template?.name || 'Template Details'}
              </h2>
              {template?.is_public && (
                <Badge variant="success" className="text-xs">
                  Public
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

            {template && !loading && !error && (
              <div className="space-y-4">
                {template.description && (
                  <div>
                    <p className="text-[var(--color-text-secondary)]">{template.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Created
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {format(new Date(template.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {template.downloads !== undefined && (
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                        Downloads
                      </p>
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {template.downloads}
                      </p>
                    </div>
                  )}
                </div>

                {template.labels && typeof template.labels === 'object' && 'name' in template.labels && (
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Label Type
                    </p>
                    <p className="text-[var(--color-text-primary)]">{template.labels.name}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/editor?templateId=${templateId}`)}
                  >
                    <Eye size={18} className="mr-2" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/api/templates/${templateId}/download`, '_blank')}
                  >
                    <Download size={18} className="mr-2" />
                    Download
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
