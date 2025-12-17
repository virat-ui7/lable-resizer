import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { loadDesign, updateDesign, deleteDesign } from '@/server/actions/designs'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/labels/[id]
 * Fetch a specific label design by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await loadDesign(params.id)

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Design not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Get label design error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch label design' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/labels/[id]
 * Update a label design
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, elements, isTemplate } = body

    const updateParams: any = {}
    if (name !== undefined) updateParams.name = name
    if (description !== undefined) updateParams.description = description
    if (elements !== undefined) updateParams.elements = elements
    if (isTemplate !== undefined) updateParams.isTemplate = isTemplate

    const result = await updateDesign(params.id, updateParams)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update design' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Update label design error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update label design' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/labels/[id]
 * Delete a label design
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const result = await deleteDesign(params.id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete design' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully',
    })
  } catch (error) {
    console.error('Delete label design error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete label design' },
      { status: 500 }
    )
  }
}