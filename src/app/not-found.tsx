import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

/**
 * 404 Not Found page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
      <Card className="max-w-md w-full">
        <Card.Body className="text-center">
          <h1 className="text-6xl font-bold text-[var(--color-text-primary)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Page Not Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/dashboard">
            <Button variant="primary">
              <Home size={18} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  )
}

