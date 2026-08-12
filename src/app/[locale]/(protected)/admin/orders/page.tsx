'use client';
import { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch('/api/admin/orders').then(r => r.json()).then(setOrders);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleAction = async (orderId: string, action: 'approve' | 'reject') => {
    setActionLoading(`${orderId}-${action}`);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Action failed. Please try again.');
      }
    } catch {
      alert('An error occurred.');
    } finally {
      setActionLoading(null);
    }
  };

  const instructors = useMemo(() => {
    const seen = new Map<string, string>();
    orders.forEach(o => {
      if (o.course?.instructor?.id) {
        const name = `${o.course.instructor.firstName} ${o.course.instructor.lastName}`;
        seen.set(o.course.instructor.id, name);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [orders]);

  const filtered = orders.filter(o => {
    const matchesSearch =
      `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
      o.course?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesInstructor = !instructorFilter || o.course?.instructor?.id === instructorFilter;
    return matchesSearch && matchesInstructor;
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-white tracking-tight mb-8">Orders</h1>
      <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 w-full pl-9"
            />
          </div>
          {instructors.length > 0 && (
            <select
              value={instructorFilter}
              onChange={e => setInstructorFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 sm:w-56"
            >
              <option value="">All Instructors</option>
              {instructors.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Course</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Instructor</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Amount</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Method</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-200">{o.user?.firstName} {o.user?.lastName}</div>
                    <div className="text-xs text-slate-500">{o.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{o.course?.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {o.course?.instructor
                      ? `${o.course.instructor.firstName} ${o.course.instructor.lastName}`
                      : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{formatPrice(o.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-400">
                      {o.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : o.paymentMethod || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      o.paymentStatus === 'COMPLETED' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                      o.paymentStatus === 'PENDING'   ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4">
                    {o.paymentStatus === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(o.id, 'approve')}
                          disabled={actionLoading !== null}
                          title="Approve enrolment"
                          className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 disabled:opacity-40"
                        >
                          <CheckCircle size={15} />
                          {actionLoading === `${o.id}-approve` ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(o.id, 'reject')}
                          disabled={actionLoading !== null}
                          title="Reject enrolment"
                          className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
                        >
                          <XCircle size={15} />
                          {actionLoading === `${o.id}-reject` ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-600">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
