import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { authenticateApiKey, checkRateLimit, incrementApiUsage } from '../labels/route'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/v1/stats
 * Get user statistics
 * Requires: API key authentication
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    const authenticatedUser = await authenticateApiKey(apiKey)
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const rateLimitCheck = await checkRateLimit(authenticatedUser.user_id, apiKey)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('labels_used_this_month, batches_used_this_month, subscription_tier')
      .eq('id', authenticatedUser.user_id)
      .single()

    const { count: templatesCount } = await supabase
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authenticatedUser.user_id)

    const { count: designsCount } = await supabase
      .from('label_designs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authenticatedUser.user_id)

    const { data: apiKeyRecord } = await supabase
      .from('api_keys')
      .select('requests_today')
      .eq('id', authenticatedUser.key_id)
      .single()

    await incrementApiUsage(authenticatedUser.user_id, apiKey)

    return NextResponse.json({
      success: true,
      data: {
        labels_used_this_month: profile?.labels_used_this_month || 0,
        batches_used_this_month: profile?.batches_used_this_month || 0,
        templates_count: templatesCount || 0,
        designs_count: designsCount || 0,
        api_requests_today: apiKeyRecord?.requests_today || 0,
        api_requests_limit: 2000,
        subscription_tier: profile?.subscription_tier || 'free',
      },
    })
  } catch (error) {
    console.error('API stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

