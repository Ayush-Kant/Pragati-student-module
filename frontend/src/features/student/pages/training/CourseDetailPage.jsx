import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  PlayCircle,
  Send,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import { getCourseById, updateLessonProgress } from '../../services/studentCourse.service';

const flattenLessons = (modules = []) => modules.flatMap((module) =>
  (module.lessons || []).map((lesson) => ({ ...lesson, moduleTitle: module.title })),
);

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCourseById(courseId);
        if (!active) return;
        setCourse(data);

        const modules = data?.modules || [];
        const firstModule = modules[0];
        const firstLesson = firstModule?.lessons?.[0];
        setSelectedLessonId(firstLesson?.id ?? null);
        setExpandedModules(Object.fromEntries(modules.map((module, index) => [module.id, index === 0])));
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || 'Unable to load this course.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [courseId]);

  const lessons = useMemo(() => flattenLessons(course?.modules), [course]);
  const selectedLesson = useMemo(
    () => lessons.find((lesson) => Number(lesson.id) === Number(selectedLessonId)) || lessons[0],
    [lessons, selectedLessonId],
  );

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : Number(course?.progress || 0);

  const handleSelectLesson = (lesson, moduleId) => {
    setSelectedLessonId(lesson.id);
    setExpandedModules((current) => ({ ...current, [moduleId]: true }));
  };

  const handleProgress = async () => {
    if (!selectedLesson || saving) return;

    setSaving(true);
    setError('');
    try {
      const result = await updateLessonProgress(
        courseId,
        selectedLesson.id,
        !selectedLesson.completed,
      );

      setCourse((current) => ({
        ...current,
        progress: result.progress,
        completedLessons: result.completedLessons,
        totalLessons: result.totalLessons,
        modules: current.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => (
            Number(lesson.id) === Number(selectedLesson.id)
              ? { ...lesson, completed: result.completed }
              : lesson
          )),
        })),
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to update lesson progress.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentPageShell>
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-9 w-2/3 rounded bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-[500px] rounded-2xl bg-slate-200" />
            <div className="h-[500px] rounded-2xl bg-slate-200" />
          </div>
        </div>
      </StudentPageShell>
    );
  }

  if (error && !course) {
    return (
      <StudentPageShell>
        <Link to="/student/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <Link to="/student/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600">
        <ArrowLeft size={16} /> Back to courses
      </Link>

      <StudentPageHeader title={course.title} subtitle={`${course.category} • ${course.level}`} />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm leading-6 text-slate-600">{course.description}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {completedLessons}/{lessons.length} lessons completed
              {course.duration ? ` • ${course.duration}` : ''}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Course progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Course content</h2>
            <p className="mt-1 text-xs text-slate-500">Select a lesson to continue learning.</p>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-2">
            {course.modules.map((module) => {
              const expanded = Boolean(expandedModules[module.id]);
              const moduleCompleted = (module.lessons || []).filter((lesson) => lesson.completed).length;

              return (
                <div key={module.id} className="mb-1 overflow-hidden rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setExpandedModules((current) => ({ ...current, [module.id]: !expanded }))}
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-800">{module.title}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">{moduleCompleted}/{module.lessons.length} completed</span>
                    </span>
                    {expanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 p-1">
                      {module.lessons.map((lesson) => {
                        const selected = Number(lesson.id) === Number(selectedLesson?.id);
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => handleSelectLesson(lesson, module.id)}
                            className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition ${selected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                            ) : (
                              <PlayCircle size={16} className="mt-0.5 shrink-0 text-slate-400" />
                            )}
                            <span className="min-w-0">
                              <span className="block text-xs font-medium">{lesson.title}</span>
                              {lesson.duration && <span className="mt-0.5 block text-[10px] text-slate-400">{lesson.duration}</span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {!selectedLesson ? (
            <div className="grid min-h-[480px] place-items-center p-8 text-center">
              <div>
                <PlayCircle className="mx-auto mb-3 text-slate-300" size={42} />
                <h2 className="text-lg font-semibold text-slate-900">No lessons available</h2>
                <p className="mt-1 text-sm text-slate-500">This course does not have learning content yet.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{selectedLesson.moduleTitle}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{selectedLesson.title}</h2>
              </div>

              <div className="p-5">
                <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950">
                  {selectedLesson.videoUrl ? (
                    <iframe
                      title={selectedLesson.title}
                      src={selectedLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-center text-white">
                      <div>
                        <PlayCircle className="mx-auto mb-3 text-blue-300" size={44} />
                        <p className="text-sm font-medium">Video content is not available for this lesson.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm leading-6 text-slate-600">{selectedLesson.description || 'Work through this lesson and mark it complete when you are finished.'}</p>
                    {selectedLesson.duration && (
                      <p className="mt-2 text-xs font-medium text-slate-500">Duration: {selectedLesson.duration}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleProgress}
                    disabled={saving}
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${selectedLesson.completed ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    <CheckCircle2 size={16} />
                    {saving ? 'Saving...' : selectedLesson.completed ? 'Mark incomplete' : 'Mark complete'}
                  </button>
                </div>

                {selectedLesson.resources?.length > 0 && (
                  <div className="mt-7 border-t border-slate-100 pt-5">
                    <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {selectedLesson.resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.fileUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <FileText size={17} className="text-blue-600" />
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{resource.title}</span>
                            <span className="text-[11px] text-slate-400">{resource.type || 'Resource'}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </StudentPageShell>
  );
}
