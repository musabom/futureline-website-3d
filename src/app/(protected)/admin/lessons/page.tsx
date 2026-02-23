'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2, Edit, Save, X, GripVertical, Video, FileText, HelpCircle, BookOpen } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface LessonData {
  id?: string;
  courseId: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonType: 'CONTENT' | 'QUIZ';
  videoUrl: string;
  content: string;
  resources: string;
  questions: Question[];
  orderIndex: number;
}

interface Course {
  id: string;
  title: string;
}

const emptyLesson = (courseId: string, moduleTitle: string, orderIndex: number): LessonData => ({
  courseId,
  moduleTitle,
  lessonTitle: '',
  lessonType: 'CONTENT',
  videoUrl: '',
  content: '',
  resources: '',
  questions: [],
  orderIndex,
});

const emptyQuestion = (): Question => ({
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
});

function parseLessonsResponse(data: any[]): LessonData[] {
  return data.map(l => ({
    id: l.id,
    courseId: l.courseId,
    moduleTitle: l.moduleTitle,
    lessonTitle: l.lessonTitle,
    lessonType: l.lessonType || 'CONTENT',
    videoUrl: l.videoUrl || '',
    content: l.content || '',
    resources: l.resources || '',
    questions: (l.questions as Question[]) || [],
    orderIndex: l.orderIndex,
  }));
}

function SortableLesson({
  lesson,
  editingLesson,
  editForm,
  setEditForm,
  saveLesson,
  setEditingLesson,
  startEdit,
  deleteLesson,
  saving,
}: {
  lesson: LessonData;
  editingLesson: string | null;
  editForm: LessonData | null;
  setEditForm: (l: LessonData | null) => void;
  saveLesson: (l: LessonData) => void;
  setEditingLesson: (id: string | null) => void;
  startEdit: (l: LessonData) => void;
  deleteLesson: (id: string) => void;
  saving: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id || `temp-${lesson.orderIndex}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  if (editingLesson === lesson.id && editForm) {
    return (
      <div ref={setNodeRef} style={style}>
        <LessonForm
          lesson={editForm}
          onChange={setEditForm}
          onSave={() => saveLesson(editForm)}
          onCancel={() => { setEditingLesson(null); setEditForm(null); }}
          saving={saving}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 ${isDragging ? 'bg-teal/5' : ''}`}>
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 text-gray-300 hover:text-gray-500 touch-none"
          title="Drag to reorder lesson"
        >
          <GripVertical size={16} />
        </button>
        {lesson.lessonType === 'QUIZ' ? (
          <HelpCircle className="text-orange-400 flex-shrink-0" size={16} />
        ) : (
          <BookOpen className="text-teal flex-shrink-0" size={16} />
        )}
        <div>
          <span className="text-sm font-medium text-gray-700">{lesson.lessonTitle}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${lesson.lessonType === 'QUIZ' ? 'bg-orange-50 text-orange-500' : 'bg-teal/10 text-teal'}`}>
              {lesson.lessonType}
            </span>
            {lesson.videoUrl && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Video size={10} /> Video</span>}
            {lesson.content && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><FileText size={10} /> Notes</span>}
            {lesson.lessonType === 'QUIZ' && lesson.questions?.length > 0 && (
              <span className="text-[10px] text-gray-400">{lesson.questions.length} questions</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => startEdit(lesson)} className="p-2 text-gray-400 hover:text-teal rounded-lg"><Edit size={14} /></button>
        <button onClick={() => lesson.id && deleteLesson(lesson.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function SortableModule({
  moduleName,
  moduleIndex,
  moduleLessons,
  isExpanded,
  toggleModule,
  startAddLesson,
  deleteModule,
  editingLesson,
  editForm,
  setEditForm,
  saveLesson,
  setEditingLesson,
  startEdit,
  deleteLesson,
  addingTo,
  newLesson,
  setNewLesson,
  setAddingTo,
  saving,
  onLessonDragEnd,
}: {
  moduleName: string;
  moduleIndex: number;
  moduleLessons: LessonData[];
  isExpanded: boolean;
  toggleModule: (name: string) => void;
  startAddLesson: (name: string) => void;
  deleteModule: (name: string) => void;
  editingLesson: string | null;
  editForm: LessonData | null;
  setEditForm: (l: LessonData | null) => void;
  saveLesson: (l: LessonData) => void;
  setEditingLesson: (id: string | null) => void;
  startEdit: (l: LessonData) => void;
  deleteLesson: (id: string) => void;
  addingTo: string | null;
  newLesson: LessonData | null;
  setNewLesson: (l: LessonData | null) => void;
  setAddingTo: (s: string | null) => void;
  saving: boolean;
  onLessonDragEnd: (moduleName: string, event: DragEndEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `module-${moduleName}` });

  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  const lessonIds = moduleLessons.map(l => l.id || `temp-${l.orderIndex}`);

  return (
    <div ref={setNodeRef} style={style} className={`card overflow-hidden ${isDragging ? 'shadow-xl ring-2 ring-teal/30' : ''}`}>
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 touch-none"
            title="Drag to reorder module"
          >
            <GripVertical size={20} />
          </button>
          <button onClick={() => toggleModule(moduleName)} className="flex items-center gap-3 text-left flex-1">
            {isExpanded ? <ChevronDown className="text-teal" size={20} /> : <ChevronRight className="text-gray-400" size={20} />}
            <div>
              <h3 className="font-semibold text-navy">Module {moduleIndex + 1}: {moduleName}</h3>
              <span className="text-xs text-gray-400">{moduleLessons.length} lesson{moduleLessons.length !== 1 ? 's' : ''}</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => startAddLesson(moduleName)} className="p-2 text-teal hover:bg-teal/10 rounded-lg" title="Add lesson">
            <Plus size={16} />
          </button>
          <button onClick={() => deleteModule(moduleName)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg" title="Delete module">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-100">
          <DndContext
            sensors={lessonSensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => onLessonDragEnd(moduleName, event)}
          >
            <SortableContext items={lessonIds} strategy={verticalListSortingStrategy}>
              {moduleLessons.map(lesson => (
                <SortableLesson
                  key={lesson.id || `temp-${lesson.orderIndex}`}
                  lesson={lesson}
                  editingLesson={editingLesson}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  saveLesson={saveLesson}
                  setEditingLesson={setEditingLesson}
                  startEdit={startEdit}
                  deleteLesson={deleteLesson}
                  saving={saving}
                />
              ))}
            </SortableContext>
          </DndContext>

          {addingTo === moduleName && newLesson && (
            <LessonForm
              lesson={newLesson}
              onChange={setNewLesson}
              onSave={() => saveLesson(newLesson)}
              onCancel={() => { setAddingTo(null); setNewLesson(null); }}
              saving={saving}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LessonData | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState<LessonData | null>(null);
  const [newModuleName, setNewModuleName] = useState('');
  const [showNewModule, setShowNewModule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);

  const moduleSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch('/api/admin/courses').then(r => r.json()).then(setCourses);
  }, []);

  const fetchLessons = useCallback(async () => {
    if (!selectedCourse) return;
    const res = await fetch(`/api/admin/lessons?courseId=${selectedCourse}`);
    const data = await res.json();
    setLessons(parseLessonsResponse(data));
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons();
      setExpandedModules(new Set());
      setEditingLesson(null);
      setAddingTo(null);
    } else {
      setLessons([]);
    }
  }, [selectedCourse, fetchLessons]);

  const { modules, moduleNames } = useMemo(() => {
    const sorted = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
    const groups: Record<string, LessonData[]> = {};
    const orderedNames: string[] = [];
    sorted.forEach(l => {
      if (!groups[l.moduleTitle]) {
        groups[l.moduleTitle] = [];
        orderedNames.push(l.moduleTitle);
      }
      groups[l.moduleTitle].push(l);
    });
    return { modules: groups, moduleNames: orderedNames };
  }, [lessons]);

  const moduleIds = useMemo(() => moduleNames.map(n => `module-${n}`), [moduleNames]);

  const toggleModule = (name: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const persistOrder = async (updatedLessons: LessonData[]) => {
    const updates = updatedLessons
      .filter(l => l.id)
      .map(l => ({ id: l.id!, orderIndex: l.orderIndex }));

    if (updates.length === 0) return;

    setReordering(true);
    try {
      const res = await fetch('/api/admin/lessons/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: selectedCourse, updates }),
      });
      if (!res.ok) {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Reorder failed, refetching...', err);
      await fetchLessons();
    }
    setReordering(false);
  };

  const handleModuleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeModuleName = (active.id as string).replace('module-', '');
    const overModuleName = (over.id as string).replace('module-', '');

    const oldIndex = moduleNames.indexOf(activeModuleName);
    const newIndex = moduleNames.indexOf(overModuleName);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(moduleNames, oldIndex, newIndex);

    const newLessons: LessonData[] = [];
    let idx = 0;
    for (const modName of newOrder) {
      for (const lesson of modules[modName]) {
        newLessons.push({ ...lesson, orderIndex: idx });
        idx++;
      }
    }
    setLessons(newLessons);
    await persistOrder(newLessons);
  };

  const handleLessonDragEnd = async (moduleName: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const moduleLessons = modules[moduleName];
    if (!moduleLessons) return;

    const oldIndex = moduleLessons.findIndex(l => (l.id || `temp-${l.orderIndex}`) === active.id);
    const newIndex = moduleLessons.findIndex(l => (l.id || `temp-${l.orderIndex}`) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const existingSlots = moduleLessons.map(l => l.orderIndex);
    const reorderedModuleLessons = arrayMove(moduleLessons, oldIndex, newIndex);
    const updatedModuleLessons = reorderedModuleLessons.map((l, i) => ({
      ...l,
      orderIndex: existingSlots[i],
    }));

    const changedIds = new Set(updatedModuleLessons.map(l => l.id));
    const newLessons = lessons.map(l => {
      if (changedIds.has(l.id)) {
        return updatedModuleLessons.find(u => u.id === l.id)!;
      }
      return l;
    });
    setLessons(newLessons);
    await persistOrder(updatedModuleLessons);
  };

  const saveLesson = async (lesson: LessonData) => {
    setSaving(true);
    const body = {
      ...lesson,
      orderIndex: Number(lesson.orderIndex),
      questions: lesson.lessonType === 'QUIZ' ? lesson.questions : null,
      videoUrl: lesson.lessonType === 'CONTENT' ? lesson.videoUrl : null,
    };

    if (lesson.id) {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    await fetchLessons();
    setEditingLesson(null);
    setEditForm(null);
    setAddingTo(null);
    setNewLesson(null);
    setSaving(false);
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  const deleteModule = async (moduleName: string) => {
    const moduleLessons = modules[moduleName];
    if (!moduleLessons || moduleLessons.length === 0) return;
    if (!confirm(`Delete module "${moduleName}" and all its ${moduleLessons.length} lessons?`)) return;
    for (const l of moduleLessons) {
      if (l.id) await fetch(`/api/admin/lessons/${l.id}`, { method: 'DELETE' });
    }
    setLessons(prev => prev.filter(l => l.moduleTitle !== moduleName));
  };

  const startAddLesson = (moduleName: string) => {
    const moduleLessons = modules[moduleName] || [];
    const maxOrder = moduleLessons.length > 0 ? Math.max(...moduleLessons.map(l => l.orderIndex)) : 0;
    setAddingTo(moduleName);
    setNewLesson(emptyLesson(selectedCourse, moduleName, maxOrder + 1));
    if (!expandedModules.has(moduleName)) {
      setExpandedModules(prev => new Set(prev).add(moduleName));
    }
  };

  const addNewModule = () => {
    if (!newModuleName.trim()) return;
    startAddLesson(newModuleName.trim());
    setShowNewModule(false);
    setNewModuleName('');
  };

  const startEdit = (lesson: LessonData) => {
    setEditingLesson(lesson.id || null);
    setEditForm({ ...lesson });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">Course Builder</h1>
        {reordering && <span className="text-sm text-teal animate-pulse">Saving order...</span>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          className="input-field max-w-md"
        >
          <option value="">Choose a course...</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <>
          <div className="flex items-center gap-3 mb-6">
            {showNewModule ? (
              <div className="flex items-center gap-2">
                <input
                  value={newModuleName}
                  onChange={e => setNewModuleName(e.target.value)}
                  placeholder="Module name..."
                  className="input-field"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && addNewModule()}
                />
                <button onClick={addNewModule} className="btn-primary text-sm !px-4 !py-2">Add</button>
                <button onClick={() => { setShowNewModule(false); setNewModuleName(''); }} className="btn-secondary text-sm !px-4 !py-2">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowNewModule(true)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={18} /> Add Module
              </button>
            )}
          </div>

          <DndContext
            sensors={moduleSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleModuleDragEnd}
          >
            <SortableContext items={moduleIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {moduleNames.map((moduleName, moduleIndex) => (
                  <SortableModule
                    key={moduleName}
                    moduleName={moduleName}
                    moduleIndex={moduleIndex}
                    moduleLessons={modules[moduleName]}
                    isExpanded={expandedModules.has(moduleName)}
                    toggleModule={toggleModule}
                    startAddLesson={startAddLesson}
                    deleteModule={deleteModule}
                    editingLesson={editingLesson}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    saveLesson={saveLesson}
                    setEditingLesson={setEditingLesson}
                    startEdit={startEdit}
                    deleteLesson={deleteLesson}
                    addingTo={addingTo}
                    newLesson={newLesson}
                    setNewLesson={setNewLesson}
                    setAddingTo={setAddingTo}
                    saving={saving}
                    onLessonDragEnd={handleLessonDragEnd}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {addingTo && !modules[addingTo] && newLesson && (
            <div className="card overflow-hidden mt-4">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ChevronDown className="text-teal" size={20} />
                  <h3 className="font-semibold text-navy">New Module: {addingTo}</h3>
                </div>
              </div>
              <LessonForm
                lesson={newLesson}
                onChange={setNewLesson}
                onSave={() => saveLesson(newLesson)}
                onCancel={() => { setAddingTo(null); setNewLesson(null); }}
                saving={saving}
              />
            </div>
          )}

          {Object.keys(modules).length === 0 && !addingTo && (
            <div className="card p-12 text-center">
              <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No modules yet</h3>
              <p className="text-gray-400 text-sm">Click "Add Module" to start building your course</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LessonForm({
  lesson,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  lesson: LessonData;
  onChange: (l: LessonData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const updateQuestion = (index: number, field: string, value: any) => {
    const questions = [...lesson.questions];
    questions[index] = { ...questions[index], [field]: value };
    onChange({ ...lesson, questions });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const questions = [...lesson.questions];
    const options = [...questions[qIndex].options];
    options[oIndex] = value;
    questions[qIndex] = { ...questions[qIndex], options };
    onChange({ ...lesson, questions });
  };

  const addQuestion = () => {
    onChange({ ...lesson, questions: [...lesson.questions, emptyQuestion()] });
  };

  const removeQuestion = (index: number) => {
    onChange({ ...lesson, questions: lesson.questions.filter((_, i) => i !== index) });
  };

  return (
    <div className="px-5 py-4 bg-blue-50/30 border-l-4 border-l-teal">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={lesson.lessonTitle}
            onChange={e => onChange({ ...lesson, lessonTitle: e.target.value })}
            placeholder="Lesson Title"
            className="input-field md:col-span-2"
            required
          />
          <select
            value={lesson.lessonType}
            onChange={e => onChange({ ...lesson, lessonType: e.target.value as 'CONTENT' | 'QUIZ' })}
            className="input-field"
          >
            <option value="CONTENT">Content Lesson</option>
            <option value="QUIZ">Quiz / Exercise</option>
          </select>
        </div>

        {lesson.lessonType === 'CONTENT' && (
          <div className="space-y-3">
            <input
              value={lesson.videoUrl}
              onChange={e => onChange({ ...lesson, videoUrl: e.target.value })}
              placeholder="YouTube or Vimeo URL (optional)"
              className="input-field"
            />
            <textarea
              value={lesson.content}
              onChange={e => onChange({ ...lesson, content: e.target.value })}
              placeholder="Lesson Notes (shown to students)"
              className="input-field"
              rows={4}
            />
            <input
              value={lesson.resources}
              onChange={e => onChange({ ...lesson, resources: e.target.value })}
              placeholder="Attachment URLs (one per line, optional)"
              className="input-field"
            />
          </div>
        )}

        {lesson.lessonType === 'QUIZ' && (
          <div className="space-y-4">
            <textarea
              value={lesson.content}
              onChange={e => onChange({ ...lesson, content: e.target.value })}
              placeholder="Quiz instructions or description (optional)"
              className="input-field"
              rows={2}
            />

            {lesson.questions.map((q, qi) => (
              <div key={qi} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-navy">Question {qi + 1}</span>
                  <button onClick={() => removeQuestion(qi)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                </div>
                <input
                  value={q.question}
                  onChange={e => updateQuestion(qi, 'question', e.target.value)}
                  placeholder="Enter question..."
                  className="input-field mb-3"
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                        className="accent-teal"
                      />
                      <input
                        value={opt}
                        onChange={e => updateOption(qi, oi, e.target.value)}
                        placeholder={`Option ${oi + 1}`}
                        className="input-field flex-1"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Select the radio button next to the correct answer</p>
              </div>
            ))}

            <button onClick={addQuestion} className="flex items-center gap-2 text-sm text-teal hover:underline">
              <Plus size={14} /> Add Question
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button onClick={onSave} disabled={saving || !lesson.lessonTitle.trim()} className="btn-primary text-sm !px-5 !py-2 flex items-center gap-2 disabled:opacity-50">
            <Save size={14} /> {saving ? 'Saving...' : lesson.id ? 'Save Changes' : 'Add Lesson'}
          </button>
          <button onClick={onCancel} className="btn-secondary text-sm !px-5 !py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}
