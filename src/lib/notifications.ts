import { Resend } from 'resend';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  metadata?: Record<string, any>;
}

export interface NotificationProvider {
  sendEmail(notification: EmailNotification): Promise<boolean>;
}

class ConsoleNotificationProvider implements NotificationProvider {
  async sendEmail(notification: EmailNotification): Promise<boolean> {
    console.log('[Notification] Email would be sent:');
    console.log(`  To: ${notification.to}`);
    console.log(`  Subject: ${notification.subject}`);
    console.log(`  Body: ${notification.body}`);
    if (notification.metadata) {
      console.log(`  Metadata: ${JSON.stringify(notification.metadata)}`);
    }
    return true;
  }
}

class ResendNotificationProvider implements NotificationProvider {
  private resend: Resend;
  private fromAddress: string;

  constructor(apiKey: string, fromAddress: string = process.env.RESEND_FROM_EMAIL || 'FutureLine <onboarding@resend.dev>') {
    this.resend = new Resend(apiKey);
    this.fromAddress = fromAddress;
  }

  async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromAddress,
        to: notification.to,
        subject: notification.subject,
        text: notification.body,
      });

      if (error) {
        console.error('[Resend] Error sending email:', error);
        return false;
      }

      console.log(`[Resend] Email sent successfully to ${notification.to}, id: ${data?.id}`);
      return true;
    } catch (err) {
      console.error('[Resend] Exception sending email:', err);
      return false;
    }
  }
}

const resendApiKey = process.env.RESEND_API_KEY;
let provider: NotificationProvider = resendApiKey
  ? new ResendNotificationProvider(resendApiKey)
  : new ConsoleNotificationProvider();

export function setNotificationProvider(p: NotificationProvider) {
  provider = p;
}

export function getNotificationProvider(): NotificationProvider {
  return provider;
}

export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    return await provider.sendEmail(notification);
  } catch (error) {
    console.error('[Notification] Failed to send email:', error);
    return false;
  }
}

export async function notifyWelcome(user: { name: string; email: string }) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to FutureLine!',
    body: `Dear ${user.name},\n\nWelcome to FutureLine! Your account has been created successfully.\n\nYou can now sign in and explore our professional courses, digital services, and AI solutions.\n\nSign in at any time to get started:\nhttps://future-line-main-page.replit.app/login\n\nIf you have any questions, feel free to reach out to our team.\n\nBest regards,\nFutureLine Team`,
    metadata: { type: 'welcome' },
  });
}

export async function notifyLeadStageChange(lead: { name: string; email: string; stage: string }, oldStage: string, newStage: string) {
  await sendEmail({
    to: lead.email,
    subject: `Update on your enquiry - ${lead.name}`,
    body: `Dear ${lead.name},\n\nYour enquiry status has been updated from ${oldStage} to ${newStage}.\n\nThank you for your interest.\n\nBest regards,\nFutureLine Team`,
    metadata: { type: 'lead_stage_change', oldStage, newStage },
  });
}

export async function notifyNewEnrollment(user: { name: string; email: string }, course: { title: string; slug: string }) {
  await sendEmail({
    to: user.email,
    subject: `Welcome to ${course.title}!`,
    body: `Dear ${user.name},\n\nYou have been successfully enrolled in "${course.title}".\n\nYou can access your course at any time from your dashboard.\n\nHappy learning!\n\nBest regards,\nFutureLine Team`,
    metadata: { type: 'new_enrollment', courseSlug: course.slug },
  });
}

export async function notifyAutomationTemplate(to: string, subject: string, body: string, metadata?: Record<string, any>) {
  await sendEmail({
    to,
    subject,
    body,
    metadata: { type: 'automation_template', ...metadata },
  });
}
