'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function formatPriceClient(price: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
}

export default function EnrollButton({ courseId, slug, price = 0 }: { courseId: string; slug: string; price?: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isFree = price <= 0;

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

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
      } else if (data.paymentRequired) {
        alert(data.message || 'Payment is required for this course.');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Failed to process enrollment');
    } finally {
      setLoading(false);
    }
  };

  const label = loading
    ? 'Processing...'
    : isFree
      ? 'Enroll for Free'
      : `Enroll — ${formatPriceClient(price)}`;

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="btn-primary w-full text-center disabled:opacity-50"
    >
      {label}
    </button>
  );
}
