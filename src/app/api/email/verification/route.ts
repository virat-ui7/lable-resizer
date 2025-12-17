import { NextRequest, NextResponse } from 'next/server'
import { createUserClient } from '@/lib/supabase/server'
import { sendVerificationEmail } from '@/server/actions/email'

/**
 * POST /api/email/verification
 * Send verification email
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate verification token
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error('Resend verification error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also send custom verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${session.user.id}`
    
    await sendVerificationEmail(email, verificationUrl, session.user.email?.split('@')[0])

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
    })
  } catch (error) {
    console.error('Send verification email error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send verification email' },
      { status: 500 }
    )
  }
}

