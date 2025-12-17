import { createUserClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/features/Admin/AdminDashboard'

export default async function AdminDashboardPage() {
  const { supabase, session } = await createUserClient()

  if (!session?.user) {
    return null
  }

  // Verify admin access
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Overview of system status and key metrics
        </p>
      </div>

      <AdminDashboard />
    </div>
  )
}

