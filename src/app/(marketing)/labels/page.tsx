import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Search, Package } from 'lucide-react'
import { ALL_LABELS, getCategories, getMarketplaces, searchLabels } from '@/lib/constants/labels'

export const metadata = {
  title: 'Supported Label Types - 255+ Label Formats | LabelPro',
  description:
    'Browse all 255+ supported label formats including Amazon FBA, Walmart FWA, eBay, Shopify, USPS, FedEx, UPS, and more. Find the perfect label size for your e-commerce business.',
  keywords:
    'label types, label formats, Amazon FBA labels, Walmart labels, shipping labels, thermal labels, label sizes, label dimensions',
}

export default function LabelsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header variant="marketing" />
      <main>
        {/* Hero Section */}
        <div className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              255+ Supported Label Types
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
              Professional label formats for Amazon FBA, Walmart, eBay, Shopify, and all major
              shipping carriers
            </p>
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Labels Listing Section */}
        <div className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="search"
                  placeholder="Search labels by name, category, or marketplace..."
                  className="pl-10"
                  id="label-search"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="text-center mb-12">
              <p className="text-lg text-[var(--color-text-secondary)]">
                Showing <strong className="text-[var(--color-text-primary)]">{ALL_LABELS.length}</strong>{' '}
                label types across{' '}
                <strong className="text-[var(--color-text-primary)]">{getCategories().length}</strong>{' '}
                categories
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {getCategories().map((category) => {
                const categoryLabels = ALL_LABELS.filter((label) => label.category === category)
                const categoryDisplayName = category
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')

                return (
                  <Card key={category} variant="elevated">
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          {categoryDisplayName}
                        </h3>
                        <Badge variant="primary">{categoryLabels.length}</Badge>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                        {categoryLabels.length} label format{categoryLabels.length !== 1 ? 's' : ''}{' '}
                        available
                      </p>
                      <div className="space-y-2">
                        {categoryLabels.slice(0, 5).map((label) => (
                          <div
                            key={label.id}
                            className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2"
                          >
                            <Package size={14} className="text-[var(--color-primary-500)]" />
                            <span>
                              {label.name} ({label.width_mm}mm × {label.height_mm}mm)
                            </span>
                          </div>
                        ))}
                        {categoryLabels.length > 5 && (
                          <p className="text-xs text-[var(--color-text-tertiary)] pt-2">
                            +{categoryLabels.length - 5} more formats
                          </p>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>

            {/* All Labels Table (for SEO) */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
                Complete Label Reference
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[var(--color-border-primary)]">
                      <th className="text-left py-4 px-4 font-semibold text-[var(--color-text-primary)]">
                        Label Name
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-[var(--color-text-primary)]">
                        Dimensions
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-[var(--color-text-primary)]">
                        Category
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-[var(--color-text-primary)]">
                        Print Method
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-[var(--color-text-primary)]">
                        Marketplace
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_LABELS.map((label, index) => (
                      <tr
                        key={label.id}
                        className={`border-b border-[var(--color-border-secondary)] ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[var(--color-bg-secondary)]'
                        }`}
                      >
                        <td className="py-4 px-4 text-[var(--color-text-primary)] font-medium">
                          {label.name}
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {label.width_mm}mm × {label.height_mm}mm
                          {label.width_inch && label.height_inch && (
                            <span className="text-xs text-[var(--color-text-tertiary)] block">
                              ({label.width_inch}" × {label.height_inch}")
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">
                            {label.category
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)] capitalize">
                          {label.print_method}
                        </td>
                        <td className="py-4 px-4 text-[var(--color-text-secondary)]">
                          {label.marketplace || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-12 bg-[var(--color-primary-50)] rounded-xl">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                Ready to Start Creating Labels?
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
                Sign up for free and get access to all 255+ label types, drag-and-drop editor, and
                batch processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="primary" size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

