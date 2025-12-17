import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { SettingsTabs } from '@/components/features/Settings/SettingsTabs'

export default async function SettingsPage() {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Settings
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsTabs initialProfile={profile} userEmail={session.user.email} />
    </div>
  )
}

