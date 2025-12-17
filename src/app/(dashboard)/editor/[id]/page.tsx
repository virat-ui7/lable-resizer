'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LabelEditor } from '@/components/features/LabelEditor/LabelEditor'
import { EditorOnboarding } from '@/components/features/Onboarding/EditorOnboarding'
import { useEditorStore } from '@/lib/store/editorStore'
import { loadDesign } from '@/server/actions/designs'
import { getLabelById } from '@/lib/constants/labels'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

export default function EditDesignPage() {
  const params = useParams()
  const router = useRouter()
  const designId = params.id as string
  const { setSelectedLabel, setElements, setCanvas } = useEditorStore()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    async function loadDesignData() {
      if (!designId) {
        setError('No design ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await loadDesign(designId)

        if (!result.success || !result.data) {
          setError(result.error || 'Design not found')
          setLoading(false)
          return
        }

        const design = result.data

        // Load the label associated with this design
        const label = getLabelById(design.label_base_id)
        if (!label) {
          setError('Label type not found')
          setLoading(false)
          return
        }

        // Set the label in the editor store
        setSelectedLabel({
          id: label.id,
          name: label.name,
          width_mm: label.width_mm,
          height_mm: label.height_mm,
          width_px_203dpi: label.width_px_203dpi,
          height_px_203dpi: label.height_px_203dpi,
          width_px_300dpi: label.width_px_300dpi,
          height_px_300dpi: label.height_px_300dpi,
        })

        // Set the elements from the design
        if (design.elements && Array.isArray(design.elements)) {
          setElements(design.elements)
        }

        // Initialize canvas with label dimensions
        setCanvas({
          width_px: label.width_px_300dpi,
          height_px: label.height_px_300dpi,
          dpi: 300,
          zoom_level: 100,
        })

        setLoading(false)
      } catch (err) {
        console.error('Error loading design:', err)
        setError(err instanceof Error ? err.message : 'Failed to load design')
        setLoading(false)
      }
    }

    loadDesignData()
  }, [designId, setSelectedLabel, setElements, setCanvas])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading design...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-[var(--color-error-500)] mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={() => router.push('/editor')}>
              Back to Editor
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <LabelEditor />
      <EditorOnboarding />
    </>
  )
}