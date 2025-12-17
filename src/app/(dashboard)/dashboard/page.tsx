import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function DashboardPage() {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Ready to create some labels?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    Labels This Month
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                    {profile?.labels_used_this_month || 0}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    of {profile?.subscription_tier === 'free' ? '200' : 'Unlimited'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    Batches This Month
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                    {profile?.batches_used_this_month || 0}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    of {profile?.subscription_tier === 'free' ? '4' : profile?.subscription_tier === 'pro' ? '50' : 'Unlimited'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    Plan
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)] capitalize">
                    {profile?.subscription_tier || 'Free'}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {profile?.subscription_status || 'Active'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <Card.Header>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Quick Actions
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Link href="/labels">
                  <Button variant="primary" className="w-full">
                    Browse Labels
                  </Button>
                </Link>
                <Link href="/editor">
                  <Button variant="secondary" className="w-full">
                    Create New Label
                  </Button>
                </Link>
                <Link href="/batch">
                  <Button variant="secondary" className="w-full">
                    Batch Process Labels
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" className="w-full">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Getting Started
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      Choose a label type
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Browse our library of 255+ label formats
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      Design your label
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Add text, images, barcodes, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      Print or download
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Save time with instant label generation
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

