import React from 'react'
import { Card } from '@/components/ui/Card'
import { Zap, Shield, BarChart3, Users, Printer, Code } from 'lucide-react'

export interface FeaturesSectionProps {
  className?: string
}

/**
 * Features section component for marketing pages
 * Feature cards with icons
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className }) => {
  const features = [
    {
      icon: Zap,
      iconColor: 'var(--color-primary-600)',
      bgColor: 'var(--color-primary-100)',
      title: 'Lightning Fast',
      description: 'Resize labels in seconds, not hours. Batch process hundreds of labels at once.',
    },
    {
      icon: Shield,
      iconColor: 'var(--color-success-600)',
      bgColor: 'var(--color-success-100)',
      title: '255+ Label Formats',
      description:
        'Support for Amazon FBA, Walmart FWA, eBay, Shopify, and all major shipping carriers.',
    },
    {
      icon: BarChart3,
      iconColor: 'var(--color-info-600)',
      bgColor: 'var(--color-info-100)',
      title: 'Batch Processing',
      description:
        'Upload CSV files and generate hundreds of labels automatically. Save hours every week.',
    },
    {
      icon: Users,
      iconColor: 'var(--color-warning-600)',
      bgColor: 'var(--color-warning-100)',
      title: 'Team Collaboration',
      description:
        'Invite team members, manage roles, and collaborate on label designs together.',
    },
    {
      icon: Printer,
      iconColor: 'var(--color-error-600)',
      bgColor: 'var(--color-error-100)',
      title: 'Direct Printing',
      description:
        'Print directly to your label printer. Support for DYMO, Zebra, Rollo, and more.',
    },
    {
      icon: Code,
      iconColor: 'var(--color-purple-600)',
      bgColor: 'var(--color-purple-100)',
      title: 'API Access',
      description: 'Integrate LabelPro into your workflow with our REST API. Enterprise only.',
    },
  ]

  return (
    <section id="features" className={`py-20 px-4 bg-white ${className || ''}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Everything You Need to Scale Your Business
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Powerful features designed for e-commerce sellers who value their time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} variant="elevated">
                <Card.Body>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.bgColor }}
                  >
                    <Icon size={24} style={{ color: feature.iconColor }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
