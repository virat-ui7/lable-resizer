'use client'

import React, { useEffect, useState } from 'react'
import { loadDesign } from '@/server/actions/designs'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

export interface Step3ColumnMappingProps {
  fileData: any[]
  templateId: string
  mapping: Record<string, string>
  onMappingChange: (mapping: Record<string, string>) => void
}

/**
 * Step 3: Column Mapping
 * Map CSV columns to template variables/elements
 */
export const Step3ColumnMapping: React.FC<Step3ColumnMappingProps> = ({
  fileData,
  templateId,
  mapping,
  onMappingChange,
}) => {
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  const loadTemplate = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loadDesign(templateId)
      if (result.success && result.data) {
        setTemplate(result.data)
      } else {
        setError(result.error || 'Failed to load template')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template')
    } finally {
      setLoading(false)
    }
  }

  // Extract text element properties from template to identify what needs mapping
  const getTextElementFields = () => {
    if (!template?.elements) return []
    const textElements = template.elements.filter((el: any) => el.type === 'text')
    const fields: string[] = []
    textElements.forEach((el: any) => {
      if (el.properties?.text && el.properties.text.includes('{{')) {
        // Extract variables like {{product_name}}
        const matches = el.properties.text.match(/\{\{(\w+)\}\}/g)
        if (matches) {
          matches.forEach((match: string) => {
            const field = match.replace(/[{}]/g, '')
            if (!fields.includes(field)) {
              fields.push(field)
            }
          })
        }
      }
    })
    return fields
  }

  const getCsvColumns = () => {
    if (fileData.length === 0) return []
    return Object.keys(fileData[0])
  }

  const handleMappingChange = (csvColumn: string, templateField: string) => {
    const newMapping = { ...mapping, [csvColumn]: templateField }
    onMappingChange(newMapping)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadTemplate}>Retry</Button>
      </div>
    )
  }

  const csvColumns = getCsvColumns()
  const templateFields = getTextElementFields()

  // If no template fields found, use CSV columns as available options
  const availableFields = templateFields.length > 0 ? templateFields : csvColumns
  const sampleRow = fileData[0] || {}

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Map Columns
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Match your CSV columns to template fields. Each CSV column will populate the corresponding template variable.
      </p>

      <div className="space-y-4">
        {csvColumns.map((csvColumn) => (
          <div key={csvColumn} className="flex items-center gap-4 p-4 border border-[var(--color-border-primary)] rounded-md">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                CSV Column: {csvColumn}
              </label>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Sample: {String(sampleRow[csvColumn] || '(empty)')}
              </p>
            </div>
            <div className="w-64">
              <select
                value={mapping[csvColumn] || ''}
                onChange={(e) => handleMappingChange(csvColumn, e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              >
                <option value="">-- Select mapping --</option>
                {csvColumns.map((field) => (
                  <option key={field} value={field}>
                    Map to: {field}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {fileData.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>{fileData.length}</strong> rows will be processed. Each row will generate one label.
          </p>
        </div>
      )}
    </div>
  )
}

export default Step3ColumnMapping

