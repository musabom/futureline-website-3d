'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, X, CreditCard } from 'lucide-react';

export default function EnrollButton({ courseId, slug, price = 0 }: { courseId: string; slug: string; price?: number }) {
  const t = useTranslations('enroll');
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFree = price <= 0;

  const handleFreeEnroll = async () => {
    if (!session) { router.push('/login'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.enrolled) {
        router.push(`/dashboard/course/${data.slug || slug}`);
      } else {
        alert(data.error || t('somethingWentWrong'));
      }
    } catch {
      alert(t('failedToProcess'));
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferOpen = () => {
    if (!session) { router.push('/login'); return; }
    setShowQR(true);
  };

  const handleSubmitBankTransfer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, paymentMethod: 'BANK_TRANSFER' }),
      });
      const data = await res.json();
      if (data.pendingApproval) {
        setSubmitted(true);
      } else {
        alert(data.error || t('somethingWentWrongRetry'));
      }
    } catch {
      alert(t('failedToSubmit'));
    } finally {
      setLoading(false);
    }
  };

  if (isFree) {
    return (
      <button
        onClick={handleFreeEnroll}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-widest"
      >
        {loading ? t('processing') : t('enrolForFree')}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleBankTransferOpen}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
      >
        {t('payViaBankTransfer')}
      </button>

      <button
        disabled
        className="w-full py-2.5 px-4 rounded-lg border border-hairline text-ink-muted text-sm font-semibold cursor-not-allowed bg-canvas-card flex items-center justify-center gap-2"
      >
        <CreditCard size={14} />
        <span>{t('creditCard')}</span>
        <span className="text-[10px] bg-slate-800 text-ink-muted px-2 py-0.5 rounded-full uppercase tracking-widest">{t('comingSoon')}</span>
      </button>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-card backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="text-teal-400" size={28} />
                </div>
                <h3 className="text-lg font-black text-navy tracking-tight">{t('requestSubmitted')}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {t('pendingApproval')}
                </p>
                <button
                  onClick={() => { setShowQR(false); setSubmitted(false); }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                  {t('close')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-navy tracking-tight">{t('bankTransferPayment')}</h3>
                  <button
                    onClick={() => setShowQR(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-hairline text-ink-muted hover:text-navy hover:border-hairline transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 leading-relaxed">
                  {t.rich('bankInstructions', {
                    name: 'Musab Al Sabahi, 96532326',
                    phone: '96532326',
                    strong: (chunks) => <strong className="text-amber-200">{chunks}</strong>,
                  })}
                </div>

                <button
                  onClick={handleSubmitBankTransfer}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-widest"
                >
                  {loading ? t('submitting') : t('iHavePaid')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
