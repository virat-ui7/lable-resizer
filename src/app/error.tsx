'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'
import { captureException } from '@/lib/sentry/config'

/**
 * Global error page
 * This catches errors in the app router
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    captureException(error, {
      digest: error.digest,
      page: 'error-boundary',
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
      <Card className="max-w-md w-full">
        <Card.Body className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

