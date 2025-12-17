'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OAuthButtons } from '@/components/features/Auth/OAuthButtons'
import { validateEmail, validatePassword, validateFullName, validateCompanyName } from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    acceptTerms: false,
  })
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)
  
  // Get referral code from URL
  const [referralCode, setReferralCode] = useState<string | null>(null)
  
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      setReferralCode(ref)
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Validate password strength in real-time
    if (field === 'password' && typeof value === 'string') {
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

    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || 'Invalid email'
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || 'Invalid password'
    }

    const nameValidation = validateFullName(formData.fullName)
    if (!nameValidation.valid) {
      newErrors.fullName = nameValidation.error || 'Invalid name'
    }

    const companyValidation = validateCompanyName(formData.companyName)
    if (!companyValidation.valid) {
      newErrors.companyName = companyValidation.error || 'Invalid company name'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
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
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' })
        } else {
          setErrors({ submit: authError.message })
        }
        setLoading(false)
        return
      }

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            company_name: formData.companyName || null,
            subscription_tier: 'free',
            subscription_status: 'active',
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue anyway - profile might already exist
        }

        // Apply referral code if provided
        if (referralCode && authData.user) {
          try {
            const referralResponse = await fetch('/api/referrals/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ referral_code: referralCode }),
            })

            const referralData = await referralResponse.json()
            if (referralData.success) {
              console.log('Referral code applied successfully:', referralData.reward)
            } else {
              console.warn('Failed to apply referral code:', referralData.error)
            }
          } catch (error) {
            console.error('Error applying referral code:', error)
            // Continue anyway - referral is optional
          }
        }

        // Redirect to email verification page
        router.push('/signup/success')
      }
    } catch (error) {
      console.error('Signup error:', error)
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
        Create your account
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Start resizing labels in seconds
      </p>

      {/* Referral Code Notice */}
      {referralCode && (
        <div className="mb-4 p-3 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-md">
          <p className="text-sm text-[var(--color-primary-700)]">
            🎁 Referral code detected! You'll receive a reward after signup.
          </p>
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="mb-6">
        <OAuthButtons redirectTo="/dashboard" />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-primary)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[var(--color-text-secondary)]">
              Or continue with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          error={errors.fullName}
          placeholder="John Doe"
          required
          disabled={loading}
        />

        {/* Company Name (Optional) */}
        <Input
          label="Company Name (Optional)"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          error={errors.companyName}
          placeholder="My Company Inc."
          disabled={loading}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
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

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-[var(--color-primary-500)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
              disabled={loading}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              I agree to the{' '}
              <a href="/terms" className="text-[var(--color-primary-600)] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[var(--color-primary-600)] hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-[var(--color-error-500)]">{errors.acceptTerms}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--color-text-secondary)]">Already have an account? </span>
        <Link href="/login" className="text-[var(--color-primary-600)] font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

