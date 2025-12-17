'use client'

import React, { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LabelEditor } from '@/components/features/LabelEditor/LabelEditor'
import { EditorOnboarding } from '@/components/features/Onboarding/EditorOnboarding'
import { useEditorStore } from '@/lib/store/editorStore'
import { getLabelById } from '@/lib/constants/labels'
import { Button } from '@/components/ui/Button'

export default function EditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const labelId = searchParams.get('labelId')
  const { setSelectedLabel, selectedLabel } = useEditorStore()

  useEffect(() => {
    if (labelId) {
      const label = getLabelById(labelId)
      if (label) {
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
      }
    }
  }, [labelId, setSelectedLabel])

  if (!labelId && !selectedLabel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-[var(--color-text-secondary)] mb-4">
            No label selected
          </p>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
            Please select a label type to start designing
          </p>
          <Button variant="primary" onClick={() => router.push('/labels')}>
            Browse Labels
          </Button>
        </div>
      </div>
    )
  }

  return <LabelEditor />
}

