'use client';
import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
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

  const filtered = orders.filter(o =>
    `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    o.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Orders</h1>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-navy">{o.user?.firstName} {o.user?.lastName}</div>
                    <div className="text-xs text-gray-400">{o.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{o.course?.title}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">{formatPrice(o.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-500">
                      {o.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : o.paymentMethod || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      o.paymentStatus === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                      o.paymentStatus === 'PENDING'   ? 'bg-yellow-50 text-yellow-600' :
                                                        'bg-red-50 text-red-600'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4">
                    {o.paymentStatus === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(o.id, 'approve')}
                          disabled={actionLoading !== null}
                          title="Approve enrolment"
                          className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 disabled:opacity-40"
                        >
                          <CheckCircle size={15} />
                          {actionLoading === `${o.id}-approve` ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(o.id, 'reject')}
                          disabled={actionLoading !== null}
                          title="Reject enrolment"
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-40"
                        >
                          <XCircle size={15} />
                          {actionLoading === `${o.id}-reject` ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
