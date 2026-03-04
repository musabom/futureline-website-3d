'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch('/api/admin/courses');
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  const deleteCourse = async (id: string, isPermanent: boolean) => {
    const msg = isPermanent 
      ? 'Are you sure you want to PERMANENTLY delete this course? This will also remove all associated students, orders, and lessons. This action cannot be undone.'
      : 'Are you sure you want to move this course to the archive? It will disappear from the user and instructor interfaces.';
    
    if (!confirm(msg)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete course');
      }
    } catch {
      alert('An unexpected error occurred');
    }
  };

  const restoreCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DRAFT' }),
      });
      if (res.ok) {
        fetchCourses();
      }
    } catch {
      alert('Failed to restore course');
    }
  };

  const approveCourse = async (id: string) => {
    await fetch(`/api/admin/courses/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    fetchCourses();
  };

  const rejectCourse = async (id: string) => {
    await fetch(`/api/admin/courses/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', reason: rejectReason }),
    });
    setRejectingId(null);
    setRejectReason('');
    fetchCourses();
  };

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                         c.category.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'archived') return matchesSearch && c.status === 'DELETED';
    return matchesSearch && c.status !== 'DELETED';
  });

  const pendingCount = courses.filter(c => c.approvalStatus === 'PENDING' && c.status !== 'DELETED').length;
  const archivedCount = courses.filter(c => c.status === 'DELETED').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manage Courses</h1>
          <p className="text-gray-500 mt-1">
            {courses.filter(c => c.status !== 'DELETED').length} active courses total
            {pendingCount > 0 && <span className="text-orange-500 font-medium ml-2">({pendingCount} pending approval)</span>}
          </p>
        </div>
        <Link href="/admin/courses/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Course
        </Link>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-teal border-b-2 border-teal'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Courses
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'archived'
              ? 'text-teal border-b-2 border-teal'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Archive
          {archivedCount > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {archivedCount}
            </span>
          )}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Instructor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Level</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Approval</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((course) => (
                <tr key={course.id} className={`hover:bg-gray-50/50 ${course.approvalStatus === 'PENDING' && course.status !== 'DELETED' ? 'bg-yellow-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-navy text-sm">{course.title}</div>
                    <div className="text-xs text-gray-400">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}`.trim() : <span className="text-gray-300">No instructor</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{course.level}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      course.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' :
                      course.status === 'DRAFT' ? 'bg-yellow-50 text-yellow-600' :
                      course.status === 'DELETED' ? 'bg-red-50 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>{course.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {course.status !== 'DELETED' && course.approvalStatus === 'PENDING' ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => approveCourse(course.id)}
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => setRejectingId(course.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 ml-1">
                          <Clock size={10} className="inline mr-1" />Pending
                        </span>
                      </div>
                    ) : (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        course.approvalStatus === 'APPROVED' ? 'bg-green-50 text-green-600' :
                        course.approvalStatus === 'REJECTED' ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>{course.approvalStatus || 'APPROVED'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {course.status === 'DELETED' ? (
                        <>
                          <button 
                            onClick={() => restoreCourse(course.id)} 
                            className="p-2 text-gray-400 hover:text-teal" 
                            title="Restore course"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button 
                            onClick={() => deleteCourse(course.id, true)} 
                            className="p-2 text-gray-400 hover:text-red-500" 
                            title="Delete permanently"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {course.status === 'PUBLISHED' ? (
                            <Link href={`/courses/${course.slug}`} className="p-2 text-gray-400 hover:text-navy" title="Preview course"><Eye size={16} /></Link>
                          ) : (
                            <span className="p-2 text-gray-200 cursor-not-allowed" title="Publish course to preview it"><Eye size={16} /></span>
                          )}
                          <Link href={`/admin/courses/${course.id}/edit`} className="p-2 text-gray-400 hover:text-teal"><Edit size={16} /></Link>
                          <button onClick={() => deleteCourse(course.id, false)} className="p-2 text-gray-400 hover:text-red-500" title="Move to archive"><Trash2 size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No {activeTab === 'archived' ? 'archived' : 'active'} courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-navy mb-4">Reject Course</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional, will be visible to instructor)"
              className="input-field mb-4"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setRejectingId(null); setRejectReason(''); }} className="btn-secondary text-sm">Cancel</button>
              <button onClick={() => rejectCourse(rejectingId)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
