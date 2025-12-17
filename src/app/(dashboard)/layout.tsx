import React from 'react'
import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function DashboardLayout({
  children,
  modals,
}: {
  children: React.ReactNode
  modals: React.ReactNode
}) {
  const { session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[var(--color-border-primary)] sticky top-0 z-sticky">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-[var(--color-text-primary)]">
                LabelPro
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/labels"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Labels
                </Link>
                <Link
                  href="/editor"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Editor
                </Link>
                <Link
                  href="/batch"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Batch
                </Link>
                <Link
                  href="/batch/history"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Batch History
                </Link>
                <Link
                  href="/printers"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Printers
                </Link>
                <Link
                  href="/templates"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Templates
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Modals Slot - Parallel Routes */}
      {modals}
    </div>
  )
}

