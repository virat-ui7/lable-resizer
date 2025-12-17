'use client'

import React, { useState } from 'react'
import { Step1TemplateSelection } from './Step1TemplateSelection'
import { Step2UploadData } from './Step2UploadData'
import { Step3ColumnMapping } from './Step3ColumnMapping'
import { Step4Generate } from './Step4Generate'
import { Button } from '@/components/ui/Button'
import { CheckCircle2 } from 'lucide-react'

export interface BatchProcessorProps {
  className?: string
}

interface BatchJobState {
  templateId: string | null
  uploadedFile: File | null
  fileData: any[] | null
  columnMapping: Record<string, string> | null
}

/**
 * BatchProcessor - Main wizard component for batch label processing
 * 4-step wizard: Template → Upload → Map → Generate
 */
export const BatchProcessor: React.FC<BatchProcessorProps> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [jobState, setJobState] = useState<BatchJobState>({
    templateId: null,
    uploadedFile: null,
    fileData: null,
    columnMapping: null,
  })

  const steps = [
    { number: 1, title: 'Select Template', description: 'Choose a design template' },
    { number: 2, title: 'Upload Data', description: 'Upload CSV or Excel file' },
    { number: 3, title: 'Map Columns', description: 'Match data columns to labels' },
    { number: 4, title: 'Generate', description: 'Create labels and download PDF' },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!jobState.templateId
      case 2:
        return !!jobState.uploadedFile && !!jobState.fileData
      case 3:
        return !!jobState.columnMapping
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Batch Label Processing
          </h1>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.number
                      ? 'bg-[var(--color-success-500)] text-white'
                      : currentStep === step.number
                      ? 'bg-[var(--color-primary-500)] text-white'
                      : 'bg-[var(--color-gray-200)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {step.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    currentStep > step.number
                      ? 'bg-[var(--color-success-500)]'
                      : 'bg-[var(--color-gray-200)]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 min-h-[400px]">
        {currentStep === 1 && (
          <Step1TemplateSelection
            selectedTemplateId={jobState.templateId}
            onSelect={(templateId) => setJobState({ ...jobState, templateId })}
          />
        )}
        {currentStep === 2 && (
          <Step2UploadData
            uploadedFile={jobState.uploadedFile}
            fileData={jobState.fileData}
            onUpload={(file, data) => setJobState({ ...jobState, uploadedFile: file, fileData: data })}
          />
        )}
        {currentStep === 3 && (
          <Step3ColumnMapping
            fileData={jobState.fileData || []}
            templateId={jobState.templateId || ''}
            mapping={jobState.columnMapping || {}}
            onMappingChange={(mapping) => setJobState({ ...jobState, columnMapping: mapping })}
          />
        )}
        {currentStep === 4 && (
          <Step4Generate
            templateId={jobState.templateId || ''}
            fileData={jobState.fileData || []}
            columnMapping={jobState.columnMapping || {}}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        {currentStep < 4 && (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

export default BatchProcessor

