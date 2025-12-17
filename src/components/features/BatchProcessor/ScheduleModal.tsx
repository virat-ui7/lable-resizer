'use client'

import React, { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Calendar, Clock } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  onSchedule: (scheduledFor: Date) => Promise<void>
  templateId: string
  csvData: any[]
  columnMapping: Record<string, string>
}

/**
 * ScheduleModal - Schedule batch job for later execution
 */
export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  open,
  onClose,
  onSchedule,
  templateId,
  csvData,
  columnMapping,
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // Set default to tomorrow at 9 AM
  React.useEffect(() => {
    if (open) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      
      const dateStr = tomorrow.toISOString().split('T')[0]
      const timeStr = '09:00'
      
      setDate(dateStr)
      setTime(timeStr)
    }
  }, [open])

  const handleSchedule = async () => {
    if (!date || !time) {
      showToast('Please select both date and time', 'error')
      return
    }

    const scheduledDateTime = new Date(`${date}T${time}`)
    const now = new Date()

    if (scheduledDateTime <= now) {
      showToast('Scheduled time must be in the future', 'error')
      return
    }

    setLoading(true)
    try {
      await onSchedule(scheduledDateTime)
      showToast('Batch job scheduled successfully!', 'success')
      onClose()
    } catch (error) {
      console.error('Schedule error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to schedule batch job',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Schedule Batch Job" size="md">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Schedule this batch job to run automatically at a specific date and time. The labels
            will be generated and ready for download when the scheduled time arrives.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            <Calendar size={16} className="inline mr-2" />
            Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            <Clock size={16} className="inline mr-2" />
            Time <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Scheduled for:</strong>{' '}
            {date && time
              ? new Date(`${date}T${time}`).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'Not set'}
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSchedule}
            loading={loading}
            disabled={!date || !time}
            className="flex-1"
          >
            Schedule Batch Job
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ScheduleModal

