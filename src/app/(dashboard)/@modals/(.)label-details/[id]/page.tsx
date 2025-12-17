'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/Dialog'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { X } from 'lucide-react'

export default function LabelDetailsModal() {
  const params = useParams()
  const router = useRouter()
  const labelId = params.id as string
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:11',message:'LabelDetailsModal component rendered',data:{labelId,hasParams:!!params.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const [label, setLabel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLabel() {
      try {
        setLoading(true)
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:19',message:'Label modal mounted',data:{labelId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Fetch all labels and find the one matching the ID
        const response = await fetch('/api/labels')
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:25',message:'API response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const data = await response.json()

        if (!response.ok || !data.success) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:29',message:'API error',data:{error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          setError(data.error || 'Failed to load label')
          return
        }

        // Find the label in the data array
        const labelData = Array.isArray(data.data)
          ? data.data.find((l: any) => l.id === labelId)
          : null

        if (!labelData) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:37',message:'Label not found in data',data:{labelId,dataLength:data.data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          setError('Label not found')
          return
        }

        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:42',message:'Label data loaded successfully',data:{labelName:labelData?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setLabel(labelData)
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4b46bc9e-c2de-4db1-a961-5b2c0e8b6d93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'@modals/(.)label-details/[id]/page.tsx:44',message:'Exception caught',data:{error:err instanceof Error?err.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error('Error fetching label:', err)
        setError('Failed to load label details')
      } finally {
        setLoading(false)
      }
    }

    if (labelId) {
      fetchLabel()
    }
  }, [labelId])

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open={true} onClose={handleClose} size="lg">
      <Card>
          <Card.Header className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Label Details
            </h2>
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

            {label && !loading && !error && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                    {label.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Category: {label.category}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Dimensions (mm)
                    </p>
                    <p className="text-[var(--color-text-primary)]">
                      {label.width_mm} × {label.height_mm} mm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Dimensions (inches)
                    </p>
                    <p className="text-[var(--color-text-primary)]">
                      {label.width_inches} × {label.height_inches} in
                    </p>
                  </div>
                </div>

                {label.description && (
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                      Description
                    </p>
                    <p className="text-[var(--color-text-primary)]">{label.description}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                  <Button variant="primary" onClick={() => router.push(`/editor?labelId=${labelId}`)}>
                    Use This Label
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
