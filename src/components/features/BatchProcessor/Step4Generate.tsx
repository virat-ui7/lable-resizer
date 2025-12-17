'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Download, CheckCircle2, Clock, Printer } from 'lucide-react'
import { UpgradeModal } from '../UpgradeModal'
import { ScheduleModal } from './ScheduleModal'
import { supabase } from '@/lib/supabase/client'

export interface Step4GenerateProps {
  templateId: string
  fileData: any[]
  columnMapping: Record<string, string>
}

/**
 * Step 4: Generate Labels
 * Summary, preview, and generate/download PDF
 */
export const Step4Generate: React.FC<Step4GenerateProps> = ({
  templateId,
  fileData,
  columnMapping,
}) => {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [upgradePlan, setUpgradePlan] = useState<'pro' | 'enterprise'>('pro')
  const [hasSchedulingAccess, setHasSchedulingAccess] = useState(false)

  const totalLabels = fileData.length
  const estimatedTime = Math.ceil(totalLabels * 0.12) // ~120ms per label
  const estimatedSize = Math.ceil(totalLabels * 0.05) // ~50KB per label

  useEffect(() => {
    // Check if user has scheduling access
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setHasSchedulingAccess(
                data.subscription_tier === 'pro' || data.subscription_tier === 'enterprise'
              )
            }
          })
      }
    })
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Call API endpoint
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          csv_data: fileData,
          column_mapping: columnMapping,
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.upgradeRequired) {
          setUpgradePlan(errorData.upgradePlan || 'pro')
          setUpgradeModalOpen(true)
          setError(errorData.error || 'Batch limit exceeded')
          return
        }
        throw new Error(errorData.error || 'Failed to generate labels')
      }

      const data = await response.json()

      if (data.success && data.pdf_base64) {
        // Create download URL from base64
        const blob = new Blob([Uint8Array.from(atob(data.pdf_base64), (c) => c.charCodeAt(0))], {
          type: 'application/pdf',
        })
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)

        // Auto-download
        const link = document.createElement('a')
        link.href = url
        link.download = `labels_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Generate error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate labels')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Ready to Generate
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Labels</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {totalLabels}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Est. Time</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {estimatedTime}s
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Est. Size</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {estimatedSize}MB
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Columns</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {Object.keys(columnMapping).length}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Progress */}
      {generating && (
        <Card>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Generating labels...
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[var(--color-primary-500)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Error */}
      {error && !upgradeModalOpen && (
        <Card className="border-red-200">
          <Card.Body>
            <p className="text-sm text-red-600">{error}</p>
          </Card.Body>
        </Card>
      )}

      {/* Success */}
      {downloadUrl && !generating && (
        <Card className="border-green-200">
          <Card.Body>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Labels generated successfully!
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {totalLabels} labels have been downloaded
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = downloadUrl
                  link.download = `labels_${new Date().toISOString().split('T')[0]}.pdf`
                  link.click()
                }}
              >
                <Download size={18} className="mr-2" />
                Download Again
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Generate Buttons */}
      {!downloadUrl && (
        <div className="flex gap-3 justify-end">
          {hasSchedulingAccess && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setScheduleModalOpen(true)}
              disabled={generating}
            >
              <Clock size={18} className="mr-2" />
              Schedule for Later
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            loading={generating}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Labels'}
          </Button>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade Required"
        message={error || 'You have reached your batch processing limit. Upgrade to continue creating batch labels.'}
        requiredPlan={upgradePlan}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={async (scheduledFor) => {
          try {
            const response = await fetch('/api/batch/schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                template_id: templateId,
                data_rows: fileData,
                column_mapping: columnMapping,
                scheduled_for: scheduledFor.toISOString(),
              }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              if (errorData.upgradeRequired) {
                setUpgradePlan('pro')
                setUpgradeModalOpen(true)
                throw new Error(errorData.error || 'Upgrade required')
              }
              throw new Error(errorData.error || 'Failed to schedule batch')
            }

            setScheduleModalOpen(false)
          } catch (error) {
            throw error
          }
        }}
        templateId={templateId}
        csvData={fileData}
        columnMapping={columnMapping}
      />
    </div>
  )
}

export default Step4Generate
