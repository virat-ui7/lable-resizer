'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validateEmail } from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/reset`,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Check your email
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Click the link in the email to reset your password. The link will expire in 15 minutes.
        </p>
        <Link href="/login">
          <Button variant="primary">Back to Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Reset your password
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Enter your email address and we'll send you a link to reset your password
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          error={error || undefined}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-[var(--color-primary-600)] hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

