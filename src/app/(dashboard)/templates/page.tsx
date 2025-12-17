import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { TemplatesList } from '@/components/features/Templates/TemplatesList'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function TemplatesPage() {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  // Get user's templates
  const { data: userTemplates } = await supabase
    .from('templates')
    .select('*, labels(name, category)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  // Get public templates
  const { data: publicTemplates } = await supabase
    .from('templates')
    .select('*, labels(name, category), profiles(full_name)')
    .eq('is_public', true)
    .order('downloads', { ascending: false })
    .limit(20)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Templates
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Reusable label templates for faster workflow
          </p>
        </div>
        <Link href="/editor">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <TemplatesList
        userTemplates={userTemplates || []}
        publicTemplates={publicTemplates || []}
      />
    </div>
  )
}

