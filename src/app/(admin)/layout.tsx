import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Activity,
  Shield
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabase, session } = await createUserClient()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-[var(--color-border-primary)] sticky top-0 z-sticky">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Shield size={24} className="text-purple-600" />
                Admin Panel
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2"
                >
                  <Users size={16} />
                  Users
                </Link>
                <Link
                  href="/admin/analytics"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  Analytics
                </Link>
                <Link
                  href="/admin/logs"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2"
                >
                  <FileText size={16} />
                  Audit Logs
                </Link>
                <Link
                  href="/admin/system"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2"
                >
                  <Activity size={16} />
                  System
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Back to App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

