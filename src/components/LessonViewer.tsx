'use client';
import { useState } from 'react';
import { BookOpen, CheckCircle, Play, FileText, ChevronDown, ChevronRight, Download, StickyNote } from 'lucide-react';

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

function parseResources(resources: string): { name: string; url: string }[] {
  return resources.split('\n').filter(Boolean).map(line => {
    const parts = line.split('|');
    if (parts.length === 2) {
      return { name: parts[0].trim(), url: parts[1].trim() };
    }
    try {
      new URL(line.trim());
      const filename = line.trim().split('/').pop() || 'Download';
      return { name: filename, url: line.trim() };
    } catch {
      return { name: line.trim(), url: '' };
    }
  });
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
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(lessons.slice(0, completedCount).map((l) => l.id))
  );
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const modules = lessons.reduce((acc: Record<string, Lesson[]>, lesson) => {
    if (!acc[lesson.moduleTitle]) acc[lesson.moduleTitle] = [];
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {});

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleName)) {
        next.delete(moduleName);
      } else {
        next.add(moduleName);
      }
      return next;
    });
  };

  const selectLesson = (lessonId: string, moduleName: string) => {
    setActiveLesson(activeLesson === lessonId ? null : lessonId);
    if (!expandedModules.has(moduleName)) {
      setExpandedModules(prev => new Set(prev).add(moduleName));
    }
  };

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

  const moduleNames = Object.keys(modules);

  return (
    <div className="space-y-4">
      {moduleNames.map((moduleName, moduleIndex) => {
        const moduleLessons = modules[moduleName];
        const isExpanded = expandedModules.has(moduleName);
        const completedInModule = moduleLessons.filter(l => completed.has(l.id)).length;

        return (
          <div key={moduleName} className="card overflow-hidden">
            <button
              onClick={() => toggleModule(moduleName)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="text-teal flex-shrink-0" size={20} />
                ) : (
                  <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
                )}
                <div>
                  <h3 className="font-semibold text-navy">
                    Module {moduleIndex + 1}: {moduleName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {moduleLessons.length} lessons &middot; {completedInModule}/{moduleLessons.length} completed
                  </span>
                </div>
              </div>
              {completedInModule === moduleLessons.length && moduleLessons.length > 0 && (
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              )}
            </button>

            {isExpanded && (
              <div className="divide-y divide-gray-100">
                {moduleLessons.map((lesson) => {
                  const isActive = activeLesson === lesson.id;

                  return (
                    <div key={lesson.id}>
                      <button
                        onClick={() => selectLesson(lesson.id, moduleName)}
                        className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${
                          isActive
                            ? 'bg-teal/5 border-l-4 border-l-teal'
                            : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                        }`}
                      >
                        {completed.has(lesson.id) ? (
                          <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                        ) : (
                          <Play className="text-gray-400 flex-shrink-0" size={16} />
                        )}
                        <span className={`text-sm ${isActive ? 'text-teal font-semibold' : 'text-gray-600'}`}>
                          {lesson.lessonTitle}
                        </span>
                      </button>

                      {isActive && (
                        <div className="px-6 py-6 bg-white border-t border-gray-100">
                          {lesson.videoUrl && (() => {
                            const embed = getEmbedUrl(lesson.videoUrl);
                            if (embed) {
                              return (
                                <div className="mb-6 rounded-xl overflow-hidden bg-black">
                                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                    <iframe
                                      src={embed.embedUrl}
                                      className="absolute inset-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title={lesson.lessonTitle}
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

                          {lesson.content && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <StickyNote className="text-teal" size={18} />
                                <h4 className="font-semibold text-navy text-sm">Lesson Notes</h4>
                              </div>
                              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                                  {lesson.content}
                                </div>
                              </div>
                            </div>
                          )}

                          {lesson.resources && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Download className="text-teal" size={18} />
                                <h4 className="font-semibold text-navy text-sm">Attachments</h4>
                              </div>
                              <div className="space-y-2">
                                {parseResources(lesson.resources).map((resource, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                    <FileText className="text-gray-400 flex-shrink-0" size={16} />
                                    {resource.url ? (
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-teal hover:underline font-medium"
                                        download
                                      >
                                        {resource.name}
                                      </a>
                                    ) : (
                                      <span className="text-sm text-gray-600">{resource.name}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            {completed.has(lesson.id) ? (
                              <span className="flex items-center gap-2 text-green-500 font-semibold text-sm">
                                <CheckCircle size={16} /> Completed
                              </span>
                            ) : (
                              <button
                                onClick={() => markComplete(lesson.id)}
                                className="btn-primary text-sm !px-5 !py-2"
                              >
                                Mark as Complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {moduleNames.length === 0 && (
        <div className="card p-12 text-center">
          <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
          <p className="text-gray-400">No lessons available for this course yet.</p>
        </div>
      )}
    </div>
  );
}
