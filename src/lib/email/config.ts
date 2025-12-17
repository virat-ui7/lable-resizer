/**
 * Email configuration and service abstraction
 * Supports multiple email providers (Resend, SendGrid, AWS SES, etc.)
 */

export interface EmailOptions {
  to: string | string[]
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>
}

/**
 * Resend email provider (recommended for production)
 */
class ResendEmailProvider implements EmailProvider {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ''
    this.fromEmail = process.env.EMAIL_FROM || 'LabelPro <noreply@labelpro.com>'
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.apiKey) {
        console.warn('RESEND_API_KEY not configured, email not sent')
        return { success: false, error: 'Email service not configured' }
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from || this.fromEmail,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text || this.htmlToText(options.html),
          reply_to: options.replyTo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to send email' }
      }

      return { success: true, messageId: data.id }
    } catch (error) {
      console.error('Resend email error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }
}

/**
 * Default email provider (logs to console in development)
 */
class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log('📧 EMAIL (Development Mode):')
    console.log('To:', options.to)
    console.log('Subject:', options.subject)
    console.log('Body:', options.text || options.html)
    return { success: true, messageId: `dev-${Date.now()}` }
  }
}

// Initialize email provider based on environment
const getEmailProvider = (): EmailProvider => {
  const provider = process.env.EMAIL_PROVIDER || 'console'

  switch (provider) {
    case 'resend':
      return new ResendEmailProvider()
    case 'console':
    default:
      return new ConsoleEmailProvider()
  }
}

export const emailProvider = getEmailProvider()

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return emailProvider.sendEmail(options)
}

