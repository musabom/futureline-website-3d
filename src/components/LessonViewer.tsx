'use client';
import { useState } from 'react';
import { BookOpen, CheckCircle, Play, FileText, ChevronDown, ChevronRight, Download, StickyNote, HelpCircle, CircleDot } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Lesson {
  id: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonType: string;
  content: string | null;
  videoUrl: string | null;
  resources: string | null;
  questions: Question[] | null;
  orderIndex: number;
}

function getEmbedUrl(url: string): { embedUrl: string; type: 'youtube' | 'vimeo' } | null {
  if (!url) return null;

  try {
    const trimmed = url.trim();
    // Handle full iframe paste or player URL directly
    if (trimmed.includes('player.vimeo.com/video/')) {
      const match = trimmed.match(/https?:\/\/player\.vimeo\.com\/video\/[^\s"']+/);
      if (match) return { embedUrl: match[0], type: 'vimeo' };
    }
    if (trimmed.includes('youtube.com/embed/')) {
      const match = trimmed.match(/https?:\/\/www\.youtube\.com\/embed\/[^\s"']+/);
      if (match) return { embedUrl: match[0], type: 'youtube' };
    }

    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  } catch {
    // If it's not a valid URL yet, it might be an iframe snippet we can still try to parse
  }

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`, type: 'youtube' };
  }

  // Improved Vimeo regex to capture ID and optional privacy hash (for unlisted videos)
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const hash = vimeoMatch[2];
    let embedUrl = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
    if (hash) {
      embedUrl += `&h=${hash}`;
    }
    return { embedUrl, type: 'vimeo' };
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

function QuizView({ questions, onComplete }: { questions: Question[]; onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const allAnswered = Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (score === questions.length) {
      onComplete();
    }
  };

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div key={qi} className="bg-gray-50 rounded-xl p-5">
          <p className="font-medium text-navy text-sm mb-3">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              if (!opt.trim()) return null;
              const isSelected = answers[qi] === oi;
              const isCorrect = q.correctIndex === oi;
              let optionStyle = 'border-gray-200 bg-white hover:border-teal/50';
              if (submitted) {
                if (isCorrect) optionStyle = 'border-green-400 bg-green-50';
                else if (isSelected && !isCorrect) optionStyle = 'border-red-400 bg-red-50';
              } else if (isSelected) {
                optionStyle = 'border-teal bg-teal/5';
              }

              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                  disabled={submitted}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-colors flex items-center gap-3 ${optionStyle}`}
                >
                  <CircleDot size={16} className={isSelected ? 'text-teal' : 'text-gray-300'} />
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="btn-primary text-sm !px-6 !py-2 disabled:opacity-50"
        >
          Submit Answers
        </button>
      ) : (
        <div className={`rounded-xl p-5 ${score === questions.length ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className={`font-semibold text-sm ${score === questions.length ? 'text-green-700' : 'text-orange-700'}`}>
            You scored {score} out of {questions.length}
            {score === questions.length ? ' - Perfect!' : ''}
          </p>
          {score < questions.length && (
            <button
              onClick={() => { setSubmitted(false); setAnswers({}); }}
              className="text-sm text-orange-600 hover:underline mt-2"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
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
                  const isQuiz = lesson.lessonType === 'QUIZ';

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
                        ) : isQuiz ? (
                          <HelpCircle className="text-orange-400 flex-shrink-0" size={16} />
                        ) : (
                          <Play className="text-gray-400 flex-shrink-0" size={16} />
                        )}
                        <span className={`text-sm ${isActive ? 'text-teal font-semibold' : 'text-gray-600'}`}>
                          {lesson.lessonTitle}
                        </span>
                        {isQuiz && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 text-orange-500 ml-auto">
                            Quiz
                          </span>
                        )}
                      </button>

                      {isActive && (
                        <div className="px-6 py-6 bg-white border-t border-gray-100">
                          {!isQuiz && lesson.videoUrl && (() => {
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
                                <h4 className="font-semibold text-navy text-sm">
                                  {isQuiz ? 'Instructions' : 'Lesson Notes'}
                                </h4>
                              </div>
                              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                                  {lesson.content}
                                </div>
                              </div>
                            </div>
                          )}

                          {isQuiz && lesson.questions && lesson.questions.length > 0 && (
                            <div className="mb-6">
                              <QuizView
                                questions={lesson.questions}
                                onComplete={() => markComplete(lesson.id)}
                              />
                            </div>
                          )}

                          {!isQuiz && lesson.resources && (
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

                          {!isQuiz && (
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
                          )}

                          {isQuiz && completed.has(lesson.id) && (
                            <div className="flex items-center gap-2 text-green-500 font-semibold text-sm pt-4 border-t border-gray-100">
                              <CheckCircle size={16} /> Completed
                            </div>
                          )}
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
