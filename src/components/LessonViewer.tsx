'use client';
import { useState } from 'react';
import { BookOpen, CheckCircle, Play, FileText } from 'lucide-react';

interface Lesson {
  id: string;
  moduleTitle: string;
  lessonTitle: string;
  content: string | null;
  videoUrl: string | null;
  resources: string | null;
  orderIndex: number;
}

function getEmbedUrl(url: string): { embedUrl: string; type: 'youtube' | 'vimeo' } | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  } catch {
    return null;
  }

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`, type: 'youtube' };
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`, type: 'vimeo' };
  }

  return null;
}

export default function LessonViewer({
  lessons,
  enrollmentId,
  progressPercentage,
  totalLessons,
}: {
  lessons: Lesson[];
  enrollmentId: string;
  progressPercentage: number;
  totalLessons: number;
}) {
  const completedCount = Math.floor((progressPercentage / 100) * totalLessons);
  const [activeLesson, setActiveLesson] = useState(lessons[0]?.id || '');
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(lessons.slice(0, completedCount).map((l) => l.id))
  );

  const modules = lessons.reduce((acc: Record<string, Lesson[]>, lesson) => {
    if (!acc[lesson.moduleTitle]) acc[lesson.moduleTitle] = [];
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {});

  const current = lessons.find((l) => l.id === activeLesson);

  const markComplete = async (lessonId: string) => {
    const newCompleted = new Set(completed);
    newCompleted.add(lessonId);
    setCompleted(newCompleted);

    const newProgress = (newCompleted.size / totalLessons) * 100;
    await fetch('/api/enrollment/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, progressPercentage: newProgress }),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="card overflow-hidden sticky top-24">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-navy text-sm">Course Content</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {Object.entries(modules).map(([moduleName, moduleLessons]) => (
              <div key={moduleName}>
                <div className="px-4 py-3 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                  {moduleName}
                </div>
                {moduleLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm border-b border-gray-50 transition-colors ${
                      activeLesson === lesson.id
                        ? 'bg-teal/5 text-teal border-l-4 border-l-teal'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {completed.has(lesson.id) ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                    ) : (
                      <BookOpen className="text-gray-400 flex-shrink-0" size={16} />
                    )}
                    <span className="line-clamp-1">{lesson.lessonTitle}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 order-1 lg:order-2">
        {current ? (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-navy mb-2">{current.lessonTitle}</h2>
            <p className="text-sm text-gray-400 mb-6">{current.moduleTitle}</p>

            {current.videoUrl && (() => {
              const embed = getEmbedUrl(current.videoUrl);
              if (embed) {
                return (
                  <div className="mb-6 rounded-xl overflow-hidden bg-black">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src={embed.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={current.lessonTitle}
                      />
                    </div>
                  </div>
                );
              }
              return (
                <div className="mb-6 bg-gray-50 rounded-xl p-6 flex items-center gap-3 text-gray-500">
                  <Play size={20} />
                  <span className="text-sm">Video content is available for this lesson.</span>
                </div>
              );
            })()}

            {current.content && (
              <div className="prose max-w-none text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {current.content}
              </div>
            )}

            {current.resources && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy mb-2">
                  <FileText size={16} /> Resources
                </div>
                <p className="text-sm text-gray-600">{current.resources}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              {completed.has(current.id) ? (
                <span className="flex items-center gap-2 text-green-500 font-semibold text-sm">
                  <CheckCircle size={16} /> Completed
                </span>
              ) : (
                <button
                  onClick={() => markComplete(current.id)}
                  className="btn-primary text-sm !px-5 !py-2"
                >
                  Mark as Complete
                </button>
              )}

              {lessons.indexOf(current) < lessons.length - 1 && (
                <button
                  onClick={() => setActiveLesson(lessons[lessons.indexOf(current) + 1].id)}
                  className="text-teal font-semibold text-sm hover:underline"
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-gray-400">Select a lesson to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
