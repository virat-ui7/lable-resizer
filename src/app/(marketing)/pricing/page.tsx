import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Choose the plan that fits your business. Contact us to upgrade your subscription tier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Starter Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Starter</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Perfect for testing the waters
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[var(--color-text-primary)]">$0</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>200 labels/month</strong> - Perfect for small sellers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>4 batch jobs/month</strong> - Process CSV files
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Basic label editor - All element types
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Access to all 255 label formats
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Email support (48h response)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Community access
                  </span>
                </li>
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-[var(--color-primary-500)] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[var(--color-primary-500)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Professional
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                For serious e-commerce sellers
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[var(--color-text-primary)]">$7.99</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  or $71.91/year (save 26%)
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>Unlimited labels</strong> - Scale without limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>50 batch jobs/month</strong> - Process more data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Print scheduling - Automate your workflow
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>2 team members</strong> - Collaborate with your team
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Priority support (12h response)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    No ads - Clean interface
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Advanced analytics
                  </span>
                </li>
              </ul>
              <Link href="/signup?plan=pro">
                <Button variant="primary" className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardBody>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                Enterprise
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                For high-volume operations
              </p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[var(--color-text-primary)]">$39.99</span>
                <span className="text-[var(--color-text-secondary)]">/month</span>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  or $359.91/year (save 25%)
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Everything in Professional
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>Unlimited batches</strong> - No limits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>API access</strong> - Integrate with your systems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    <strong>Unlimited team members</strong> - Scale your team
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    WMS integrations - Connect with warehouse systems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Custom SLA - Guaranteed uptime
                  </span>
                </li>
              </ul>
              <Link href="/signup?plan=enterprise">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! Contact support to upgrade or downgrade your plan. Changes take effect immediately.',
              },
              {
                q: 'What happens if I exceed my plan limits?',
                a: 'Free tier users will see a prompt to upgrade when they reach their limits. Pro and Enterprise users have unlimited labels.',
              },
              {
                q: 'How do I upgrade my plan?',
                a: 'Contact our support team or use the admin panel if you have admin access. Subscription tiers are managed manually.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can request to change your subscription tier at any time by contacting support.',
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardBody>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{faq.a}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

