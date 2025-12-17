import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo placeholder */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            LabelPro
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Professional Label Resizing
          </p>
        </div>

        {/* Auth content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          <p>
            By continuing, you agree to LabelPro's{' '}
            <a href="/terms" className="text-[var(--color-primary-600)] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[var(--color-primary-600)] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

