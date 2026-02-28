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
    console.log('[Notification] 📧 Email would be sent:');
    console.log(`  To: ${notification.to}`);
    console.log(`  Subject: ${notification.subject}`);
    console.log(`  Body: ${notification.body}`);
    if (notification.metadata) {
      console.log(`  Metadata: ${JSON.stringify(notification.metadata)}`);
    }
    return true;
  }
}

let provider: NotificationProvider = new ConsoleNotificationProvider();

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
