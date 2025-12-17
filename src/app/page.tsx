import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Check, Zap, Shield, BarChart3, Users, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border-primary)] bg-white sticky top-0 z-sticky">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-[var(--color-text-primary)]">
                LabelPro
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="#features"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Pricing
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Testimonials
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[var(--color-primary-50)] to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-6">
            Resize Labels in Seconds,
            <br />
            <span className="text-[var(--color-primary-600)]">Not Hours</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Professional label resizing for e-commerce sellers. Support for 255+ label formats
            across Amazon, Walmart, eBay, and more. No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-[var(--color-success-500)]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-[var(--color-success-500)]" />
              <span>200 free labels/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-[var(--color-success-500)]" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
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
            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center mb-4">
                  <Zap size={24} className="text-[var(--color-primary-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Lightning Fast
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Resize labels in seconds, not hours. Batch process hundreds of labels at once.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-success-100)] rounded-lg flex items-center justify-center mb-4">
                  <Shield size={24} className="text-[var(--color-success-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  255+ Label Formats
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Support for Amazon FBA, Walmart FWA, eBay, Shopify, and all major shipping carriers.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-info-100)] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-[var(--color-info-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Batch Processing
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Upload CSV files and generate hundreds of labels automatically. Save hours every week.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-warning-100)] rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} className="text-[var(--color-warning-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Team Collaboration
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Share templates with your team. Enterprise plans include unlimited team members.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-lg flex items-center justify-center mb-4">
                  <Zap size={24} className="text-[var(--color-primary-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  No Design Skills Needed
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Drag-and-drop editor makes it easy. Add text, images, barcodes with a few clicks.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardBody>
                <div className="w-12 h-12 bg-[var(--color-success-100)] rounded-lg flex items-center justify-center mb-4">
                  <Shield size={24} className="text-[var(--color-success-600)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Printer Integration
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  Connect DYMO, Zebra, Rollo, and Brother printers. Print directly from the app.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Trusted by E-commerce Sellers
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              See what our customers are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Amazon FBA Seller',
                content:
                  'LabelPro saved me 10+ hours per week. The batch processing feature is a game-changer for my business.',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'E-commerce Store Owner',
                content:
                  'Finally, a tool that supports all the label formats I need. The editor is intuitive and powerful.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Walmart Seller',
                content:
                  'Worth every penny. The time I save on label resizing pays for the subscription in the first week.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} variant="elevated">
                <CardBody>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-[var(--color-text-secondary)] mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {testimonial.role}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Choose the plan that fits your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Starter</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">$0</span>
                  <span className="text-[var(--color-text-secondary)]">/month</span>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      200 labels/month
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      4 batch jobs/month
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Basic label editor
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Email support (48h)
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

            {/* Pro Tier */}
            <Card className="border-2 border-[var(--color-primary-500)] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[var(--color-primary-500)] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Professional</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">$7.99</span>
                  <span className="text-[var(--color-text-secondary)]">/month</span>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Unlimited labels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      50 batch jobs/month
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Print scheduling
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      2 team members
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Priority support (12h)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      No ads
                    </span>
                  </li>
                </ul>
                <Link href="/signup?plan=pro">
                  <Button variant="primary" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </CardBody>
            </Card>

            {/* Enterprise Tier */}
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Enterprise</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text-primary)]">$39.99</span>
                  <span className="text-[var(--color-text-secondary)]">/month</span>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Everything in Pro
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Unlimited batches
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      API access
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Unlimited team members
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      WMS integrations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[var(--color-success-500)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Dedicated account manager
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[var(--color-primary-600)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save Hours Every Week?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of e-commerce sellers who trust LabelPro for their label resizing needs.
          </p>
          <Link href="/signup">
            <Button variant="secondary" size="lg">
              Get Started Free - No Credit Card Required
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-gray-900)] text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LabelPro</h3>
              <p className="text-gray-400 text-sm">
                Professional label resizing for e-commerce sellers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/labels" className="hover:text-white">
                    Label Types
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} LabelPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
