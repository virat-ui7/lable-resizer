import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FeaturesSection } from '@/components/sections/marketing/FeaturesSection'
import { CTASection } from '@/components/sections/marketing/CTASection'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header variant="marketing" />
      <main>
        <div className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              Powerful Features for E-commerce Sellers
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Everything you need to create, resize, and print professional labels at scale
            </p>
          </div>
        </div>
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
