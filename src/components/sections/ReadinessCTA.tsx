/**
 * ReadinessCTA — closing conversion panel.
 *
 * Wraps the existing AuditEnquiryForm rather than reimplementing it, so home
 * leads land in the same pipeline as /audit: zod validation, rate limiting,
 * prisma.lead.create, plus the confirmation and admin notification emails.
 * Only the funnel labels differ, which is what lets /admin/leads tell home
 * submissions apart from /audit ones.
 */
import { getTranslations } from 'next-intl/server';
import AuditEnquiryForm from '@/components/AuditEnquiryForm';

export async function ReadinessCTA() {
  const t = await getTranslations('cta');
  return (
    <section id="audit" aria-labelledby="readiness-heading" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="relative overflow-hidden rounded-panel border border-hairline bg-canvas-card p-8 fl-elev-3 md:p-12">
          {/* Brand wash behind the panel content */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy/[0.06] via-transparent to-teal/[0.10]"
          />

          <div className="relative">
            <div className="mb-8 text-center">
              <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                {t('eyebrow')}
              </p>
              <h2
                id="readiness-heading"
                className="mb-4 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl"
              >
                {t('heading')}
              </h2>
              <p className="mx-auto max-w-lg text-ink-muted">{t('lede')}</p>
            </div>

            <AuditEnquiryForm
              tone="light"
              enquiryType="AI Readiness Assessment"
              source="FL Home — Readiness"
              submitLabel={t('submit')}
              messageLabel={t('messageLabel')}
              messagePlaceholder={t('messagePlaceholder')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
