'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function EnrollButton({ courseId, slug, price = 0 }: { courseId: string; slug: string; price?: number }) {
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
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Failed to process enrolment');
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
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isFree) {
    return (
      <button
        onClick={handleFreeEnroll}
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Enrol for Free'}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleBankTransferOpen}
        className="btn-primary w-full text-center"
      >
        Pay via Bank Transfer
      </button>

      <button
        disabled
        className="w-full py-2.5 px-4 rounded-lg border-2 border-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed bg-gray-50 flex items-center justify-center gap-2"
      >
        <span>Credit Card</span>
        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>
      </button>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            {submitted ? (
              <div className="text-center space-y-3 py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-navy">Request Submitted</h3>
                <p className="text-sm text-gray-600">
                  Your enrolment request has been submitted and is pending admin approval. You will receive access within 12 hours.
                </p>
                <button
                  onClick={() => { setShowQR(false); setSubmitted(false); }}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy">Bank Transfer Payment</h3>
                  <button
                    onClick={() => setShowQR(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    &times;
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 leading-relaxed">
                  Please make bank payment to <strong>Musab Al Sabahi, 96532326</strong>. You <strong>MUST</strong> send the receipt to WhatsApp with your full name to <strong>96532326</strong>. Your enrolment will be approved within 12 hours.
                </div>

                <button
                  onClick={handleSubmitBankTransfer}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : "I Have Paid — Submit My Request"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
