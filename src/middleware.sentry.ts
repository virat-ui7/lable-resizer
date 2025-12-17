/**
 * Sentry middleware wrapper for Next.js middleware
 * This should be imported in middleware.ts if using Sentry
 */

import * as Sentry from '@sentry/nextjs'

export async function withSentryMiddleware(handler: (request: any) => Promise<any>) {
  return Sentry.withSentryMiddleware(handler)
}

