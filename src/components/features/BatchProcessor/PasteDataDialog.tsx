'use client'

import React, { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export interface PasteDataDialogProps {
  open: boolean
  onClose: () => void
  onPaste: (data: any[]) => void
}

/**
 * PasteDataDialog - allows users to paste CSV data as text
 */
export const PasteDataDialog: React.FC<PasteDataDialogProps> = ({
  open,
  onClose,
  onPaste,
}) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleParse = () => {
    setError(null)
    setProcessing(true)

    try {
      if (!text.trim()) {
        setError('Please paste some data')
        setProcessing(false)
        return
      }

      // Parse CSV-like text
      const lines = text.trim().split('\n')
      if (lines.length === 0) {
        setError('No data found')
        setProcessing(false)
        return
      }

      // Detect delimiter (comma, tab, or pipe)
      const firstLine = lines[0]
      let delimiter = ','
      if (firstLine.includes('\t')) {
        delimiter = '\t'
      } else if (firstLine.includes('|')) {
        delimiter = '|'
      }

      // Parse headers
      const headers = lines[0]
        .split(delimiter)
        .map((h) => h.trim().replace(/^"|"$/g, ''))

      // Parse data rows
      const data: any[] = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue // Skip empty lines

        const values = lines[i]
          .split(delimiter)
          .map((v) => v.trim().replace(/^"|"$/g, ''))

        if (values.length !== headers.length) {
          setError(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`)
          setProcessing(false)
          return
        }

        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }

      if (data.length === 0) {
        setError('No data rows found')
        setProcessing(false)
        return
      }

      // Success - pass data to parent
      onPaste(data)
      setText('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Paste Data as Text" size="lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Paste your CSV data here. The first row should be headers (column names). Data can be
            separated by commas, tabs, or pipes.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Header1,Header2,Header3&#10;Value1,Value2,Value3&#10;Value4,Value5,Value6"
            className="w-full h-64 px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] font-mono text-sm"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleParse}
            loading={processing}
            className="flex-1"
          >
            Parse & Use Data
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default PasteDataDialog

