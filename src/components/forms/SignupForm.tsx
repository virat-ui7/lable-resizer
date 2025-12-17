'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { OAuthButtons } from '@/components/features/Auth/OAuthButtons'
import { cn } from '@/lib/utils/cn'
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateCompanyName,
} from '@/lib/auth/validators'
import { supabase } from '@/lib/supabase/client'

export interface SignupFormProps {
  referralCode?: string | null
  redirectTo?: string
  onSuccess?: () => void
}

/**
 * Signup form component
 * Handles user registration with email, password, name, and optional company
 */
export const SignupForm: React.FC<SignupFormProps> = ({
  referralCode: initialReferralCode,
  redirectTo = '/dashboard',
  onSuccess,
}) => {
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
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(
    null
  )

  // Get referral code from URL if not provided as prop
  const [referralCode, setReferralCode] = useState<string | null>(initialReferralCode || null)

  useEffect(() => {
    if (!initialReferralCode) {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')
      if (ref) {
        setReferralCode(ref)
      }
    }
  }, [initialReferralCode])

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
        const { error: profileError } = await supabase.from('profiles').insert({
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
            if (!referralData.success) {
              console.error('Referral code application error:', referralData.error)
            }
          } catch (referralError) {
            console.error('Referral code application error:', referralError)
            // Don't block signup if referral fails
          }
        }

        if (onSuccess) {
          onSuccess()
        } else {
          // Redirect to email verification page
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Create your account
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Start creating professional labels in minutes
      </p>

      {/* OAuth Buttons */}
      <div className="mb-6">
        <OAuthButtons redirectTo={redirectTo} />
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

        {/* Company Name (Optional) */}
        <Input
          label="Company Name (Optional)"
          type="text"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          error={errors.companyName}
          placeholder="Acme Inc."
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
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all', getPasswordStrengthColor())}
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

        {/* Terms Acceptance */}
        <Checkbox
          label={
            <>
              I agree to the{' '}
              <Link href="/terms" className="text-[var(--color-primary-600)] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[var(--color-primary-600)] hover:underline">
                Privacy Policy
              </Link>
            </>
          }
          checked={formData.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
          error={errors.acceptTerms}
          disabled={loading}
        />

        {/* Referral Code */}
        {referralCode && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Using referral code: <strong>{referralCode}</strong>
            </p>
          </div>
        )}

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

export default SignupForm
