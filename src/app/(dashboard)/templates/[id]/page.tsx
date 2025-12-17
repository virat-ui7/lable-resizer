import { redirect } from 'next/navigation'
import { createUserClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface TemplatePageProps {
  params: {
    id: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { supabase, session } = await createUserClient()

  if (!session) {
    redirect('/login')
  }

  const { data: template, error } = await supabase
    .from('templates')
    .select('*, labels(name, category, width_mm, height_mm), profiles(full_name)')
    .eq('id', params.id)
    .single()

  if (error || !template) {
    redirect('/templates')
  }

  // Check if user owns the template or if it's public
  const isOwner = template.user_id === session.user.id
  const isPublic = template.is_public

  if (!isOwner && !isPublic) {
    redirect('/templates')
  }

  const label = template.labels
  const owner = template.profiles

  const handleDelete = async () => {
    'use server'
    if (!isOwner) return

    const { supabase: sb, session: sess } = await createUserClient()
    if (!sess) return

    await sb
      .from('templates')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', sess.user.id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4"
        >
          <ArrowLeft size={18} />
          Back to Templates
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {template.name}
              </h1>
              {template.is_public && (
                <Badge variant="success" className="text-xs">
                  Public
                </Badge>
              )}
              {!template.is_public && isOwner && (
                <Badge variant="info" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
            {template.description && (
              <p className="text-[var(--color-text-secondary)] mb-4">{template.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span>
                Created {format(new Date(template.created_at), 'MMM d, yyyy')}
              </span>
              {owner && (
                <span>
                  by {typeof owner === 'object' && 'full_name' in owner ? owner.full_name : 'Unknown'}
                </span>
              )}
              {template.downloads > 0 && (
                <span>{template.downloads} downloads</span>
              )}
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/editor?templateId=${template.id}`}>
                <Button variant="outline">
                  <Edit size={18} className="mr-2" />
                  Edit
                </Button>
              </Link>
              <form action={handleDelete}>
                <Button variant="danger" type="submit">
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Preview */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Template Preview</h2>
            </Card.Header>
            <Card.Body>
              {label && typeof label === 'object' && 'name' in label && (
                <div className="mb-4">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Label Type</p>
                  <p className="font-medium">{label.name}</p>
                  {'width_mm' in label && 'height_mm' in label && (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {label.width_mm}mm × {label.height_mm}mm
                    </p>
                  )}
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                {/* TODO: Render template preview canvas */}
                <p className="text-[var(--color-text-secondary)]">Template preview coming soon</p>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Template Details */}
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Template Details</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Template ID
                  </p>
                  <p className="text-sm font-mono">{template.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Status
                  </p>
                  <Badge variant={template.is_public ? 'success' : 'info'}>
                    {template.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Created
                  </p>
                  <p className="text-sm">
                    {format(new Date(template.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm">
                    {format(new Date(template.updated_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--color-border-primary)]">
                <Link href={`/editor?templateId=${template.id}`} className="block w-full mb-3">
                  <Button variant="primary" className="w-full">
                    <Eye size={18} className="mr-2" />
                    Use Template
                  </Button>
                </Link>
                <Link
                  href={`/api/templates/${template.id}/download`}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    <Download size={18} className="mr-2" />
                    Download Template
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}