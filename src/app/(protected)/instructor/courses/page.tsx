'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const res = await fetch('/api/instructor/courses');
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to move this course to the archive? It will be hidden from the public and your main dashboard.')) return;
    try {
      const res = await fetch(`/api/instructor/courses/${id}`, { method: 'DELETE' });
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

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                         c.category.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'archived') return matchesSearch && c.status === 'DELETED';
    return matchesSearch && c.status !== 'DELETED';
  });

  const archivedCount = courses.filter(c => c.status === 'DELETED').length;

  const approvalBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'REJECTED': return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600 flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default: return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 flex items-center gap-1"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Courses</h1>
          <p className="text-gray-500 mt-1">{courses.length} courses</p>
        </div>
        <Link href="/instructor/courses/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Create Course
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
              placeholder="Search your courses..."
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Lessons</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Approval</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No courses found</td></tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy text-sm">{course.title}</div>
                      <div className="text-xs text-gray-400">{course.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course._count?.enrollments || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course._count?.lessons || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                          course.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' :
                          course.status === 'DRAFT' ? 'bg-yellow-50 text-yellow-600' :
                          course.status === 'DELETED' ? 'bg-red-50 text-red-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>{course.status}</span>
                        {activeTab !== 'archived' && course.approvalStatus === 'APPROVED' && (
                          <button
                            onClick={() => togglePublish(course)}
                            className={`text-[10px] font-bold uppercase tracking-wider hover:underline ${
                              course.status === 'PUBLISHED' ? 'text-orange-500' : 'text-teal'
                            }`}
                          >
                            {course.status === 'PUBLISHED' ? 'Unpublish' : 'Publish Now'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{approvalBadge(course.approvalStatus)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'archived' ? (
                          <span className="text-xs text-gray-400 italic">Hidden in archive</span>
                        ) : (
                          <>
                            {course.status === 'PUBLISHED' ? (
                              <Link href={`/courses/${course.slug}`} className="p-2 text-gray-400 hover:text-navy" title="Preview course">
                                <Eye size={16} />
                              </Link>
                            ) : (
                              <span className="p-2 text-gray-200 cursor-not-allowed" title="Publish course to preview it">
                                <Eye size={16} />
                              </span>
                            )}
                            <Link href={`/instructor/courses/${course.id}/edit`} className="p-2 text-gray-400 hover:text-teal" title="Edit course">
                              <Edit size={16} />
                            </Link>
                            <button onClick={() => deleteCourse(course.id)} className="p-2 text-gray-400 hover:text-red-500" title="Move to archive"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {courses.some(c => c.approvalStatus === 'REJECTED') && (
        <div className="mt-6 card p-4 bg-red-50 border-red-100">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Rejected Courses</h3>
          {courses.filter(c => c.approvalStatus === 'REJECTED').map(c => (
            <div key={c.id} className="text-sm text-red-600 mb-1">
              <strong>{c.title}</strong>
              {c.rejectionReason && <span className="text-red-500"> - {c.rejectionReason}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
