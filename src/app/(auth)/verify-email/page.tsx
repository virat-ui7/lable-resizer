'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get current user email
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email)
      } else {
        router.push('/login')
      }
    })
  }, [router])

  const handleResend = async () => {
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        alert('Failed to send verification email: ' + error.message)
      } else {
        setSent(true)
        setTimeout(() => setSent(false), 5000)
      }
    } catch (error) {
      console.error('Resend error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckVerification = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error

      if (data.user?.email_confirmed_at) {
        // Email verified, redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Email not yet verified. Please check your inbox.')
      }
    } catch (error) {
      console.error('Check verification error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
      <Card className="max-w-md w-full">
        <Card.Body className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Please check your email and click the verification link to continue. If you don't see
            the email, check your spam folder.
          </p>

          {sent && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              Verification email sent!
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleResend}
              loading={loading}
              className="w-full"
            >
              <RefreshCw size={18} className="mr-2" />
              Resend Verification Email
            </Button>
            <Button
              variant="outline"
              onClick={handleCheckVerification}
              loading={loading}
              className="w-full"
            >
              I've Verified My Email
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                supabase.auth.signOut()
                router.push('/login')
              }}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

