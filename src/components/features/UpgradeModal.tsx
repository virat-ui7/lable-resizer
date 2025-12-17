'use client'

import React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { UpgradeButton } from './Pricing/UpgradeButton'
import { AlertCircle } from 'lucide-react'

export interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  currentPlan?: 'free' | 'pro' | 'enterprise'
  requiredPlan?: 'pro' | 'enterprise'
}

/**
 * UpgradeModal component - shows upgrade prompt when limits are reached
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
  title,
  message,
  currentPlan = 'free',
  requiredPlan = 'pro',
}) => {
  const planNames = {
    pro: 'Professional',
    enterprise: 'Enterprise',
  }

  const planFeatures: Record<string, string[]> = {
    pro: [
      'Unlimited labels per month',
      '50 batch jobs per month',
      'Print scheduling',
      '2 team members',
      'Priority support',
      'No ads',
    ],
    enterprise: [
      'Everything in Professional',
      'Unlimited batches',
      'API access',
      'Unlimited team members',
      'WMS integrations',
      'Dedicated account manager',
    ],
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-yellow-800">{message}</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
            Upgrade to {planNames[requiredPlan]} to unlock:
          </h3>
          <ul className="space-y-2">
            {planFeatures[requiredPlan].map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-success-500)] mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <UpgradeButton
            planId={requiredPlan}
            currentPlan={currentPlan}
            className="flex-1"
          />
        </div>
      </div>
    </Dialog>
  )
}

export default UpgradeModal

