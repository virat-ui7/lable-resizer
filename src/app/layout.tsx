import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { Analytics } from '@/components/providers/Analytics'
import { SentryProvider } from '@/components/providers/Sentry'
import { StructuredData } from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LabelPro - Professional Label Resizing for E-commerce',
  description:
    'Resize labels in seconds, not hours. Support for 255+ label formats across Amazon, Walmart, eBay, and more. No design skills required.',
  keywords: [
    'label resizing',
    'shipping labels',
    'Amazon FBA labels',
    'Walmart labels',
    'eBay labels',
    'label designer',
    'batch label processing',
  ],
  authors: [{ name: 'LabelPro' }],
  openGraph: {
    title: 'LabelPro - Professional Label Resizing',
    description: 'Resize labels in seconds with support for 255+ formats',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabelPro - Professional Label Resizing',
    description: 'Resize labels in seconds with support for 255+ formats',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'
  const organizationSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LabelPro',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@labelpro.io',
    },
    sameAs: ['https://twitter.com/labelpro', 'https://linkedin.com/company/labelpro'],
  })

  const softwareApplicationSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LabelPro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: ['Web Browser', 'Windows', 'macOS', 'Linux'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      ratingCount: 124,
    },
  })

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: softwareApplicationSchema }}
        />
      </head>
      <body>
        <SentryProvider>
          <Analytics />
          <ToastProvider>{children}</ToastProvider>
        </SentryProvider>
      </body>
    </html>
  )
}
