'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EnrollButton({ courseId, price }: { courseId: string; price: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      if (data.url) {
        window.location.href = data.url;
      } else if (data.enrolled) {
        router.push('/dashboard');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Failed to process enrollment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="btn-primary w-full text-center disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Enroll Now`}
    </button>
  );
}
