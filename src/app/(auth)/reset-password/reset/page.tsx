'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { validatePassword } from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'

export default function ResetPasswordConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  useEffect(() => {
    // Check if user has a valid session (required for password reset)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/reset-password?error=expired')
      }
    }
    checkSession()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Validate password strength in real-time
    if (field === 'password') {
      const validation = validatePassword(value)
      if (validation.valid && validation.strength) {
        setPasswordStrength(validation.strength)
      } else {
        setPasswordStrength(null)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || 'Invalid password'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('expired')) {
          setErrors({ submit: 'The reset link has expired. Please request a new one.' })
        } else {
          setErrors({ submit: error.message })
        }
        setLoading(false)
        return
      }

      // Success - redirect to login
      router.push('/login?password=reset')
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return ''
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
      default:
        return ''
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Set new password
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="New Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          {passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor()} transition-all`}
                    style={{
                      width:
                        passwordStrength === 'weak'
                          ? '33%'
                          : passwordStrength === 'medium'
                          ? '66%'
                          : '100%',
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--color-text-secondary)] capitalize">
                  {passwordStrength}
                </span>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
          disabled={loading}
        />

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Reset Password
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

