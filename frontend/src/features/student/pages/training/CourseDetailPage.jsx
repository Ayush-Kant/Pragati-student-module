import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronRight, PlayCircle, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import { getCourseById, getLessonById, saveLessonWatchProgress, updateLessonProgress } from '../../services/studentCourse.service';
import VideoPlayer from './components/VideoPlayer';
import ChapterMarkers from './components/ChapterMarkers';
import TranscriptViewer from './components/TranscriptViewer';
import LessonNotes from './components/LessonNotes';
import ResourceLibrary from './components/ResourceLibrary';
import LessonLockBadge from './components/LessonLockBadge';

const flattenLessons = (modules = []) => modules.flatMap((module) => (module?.lessons || []).map((lesson) => ({ ...lesson, moduleTitle: module.title })));
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTo, setSeekTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourse = async (preserveLessonId = null) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCourseById(courseId);
      const modules = Array.isArray(data?.modules) ? data.modules : [];
      setCourse({ ...data, modules });
      const allLessons = flattenLessons(modules);
      const requested = preserveLessonId ? allLessons.find((item) => Number(item.id) === Number(preserveLessonId)) : null;
      const firstUnlocked = allLessons.find((item) => !item.locked) || allLessons[0] || null;
      const nextLesson = requested && !requested.locked ? requested : firstUnlocked;
      setSelectedLessonId(nextLesson?.id ?? null);
      setExpandedModules(Object.fromEntries(modules.map((module, index) => [module.id, index === 0 || module.id === nextLesson?.moduleId])));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load this course.'));
      setCourse(null);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCourseById(courseId);
        if (!active) return;
        const modules = Array.isArray(data?.modules) ? data.modules : [];
        setCourse({ ...data, modules });
        const allLessons = flattenLessons(modules);
        const firstLesson = allLessons.find((item) => !item.locked) || allLessons[0] || null;
        setSelectedLessonId(firstLesson?.id ?? null);
        setExpandedModules(Object.fromEntries(modules.map((module, index) => [module.id, index === 0])));
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Unable to load this course.'));
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [courseId]);

  useEffect(() => {
    let active = true;
    if (!selectedLessonId || !course) { setLesson(null); return () => { active = false; }; }
    const selectedFromCourse = flattenLessons(course.modules).find((item) => Number(item.id) === Number(selectedLessonId));
    if (!selectedFromCourse || selectedFromCourse.locked) { setLesson(null); return () => { active = false; }; }
    setLessonLoading(true);
    setError('');
    getLessonById(selectedLessonId)
      .then((data) => {
        if (!active) return;
        setLesson(data || selectedFromCourse);
        setCurrentTime(Number(data?.watchedSeconds || 0));
        setSeekTo(Number(data?.watchedSeconds || 0));
      })
      .catch((err) => {
        if (!active) return;
        setLesson(null);
        setError(getErrorMessage(err, 'Unable to load this lesson.'));
      })
      .finally(() => { if (active) setLessonLoading(false); });
    return () => { active = false; };
  }, [selectedLessonId, course]);

  const lessons = useMemo(() => flattenLessons(course?.modules), [course]);
  const completedLessons = lessons.filter((item) => item.completed).length;
  const progress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : Number(course?.progress || 0);

  const handleSelectLesson = (nextLesson, moduleId) => {
    if (nextLesson?.locked) return;
    setSelectedLessonId(nextLesson.id);
    setCurrentTime(Number(nextLesson.watchedSeconds || 0));
    setSeekTo(Number(nextLesson.watchedSeconds || 0));
    setExpandedModules((current) => ({ ...current, [moduleId]: true }));
  };

  const handleWatchProgress = async (watchedSeconds, totalSeconds) => {
    if (!lesson || progressSaving || totalSeconds <= 0) return;
    setProgressSaving(true);
    try {
      const lessonId = lesson.lessonId || lesson.id;
      const result = await saveLessonWatchProgress(lessonId, watchedSeconds, totalSeconds);
      setLesson((current) => current ? { ...current, watchedSeconds: result.watchedSeconds, totalSeconds: result.totalSeconds, progressPercent: result.completionPercent, watchProgress: result.completionPercent, completed: result.lessonCompleted } : current);
      if (result.lessonCompleted) await loadCourse(lessonId);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save watch progress.'));
    } finally { setProgressSaving(false); }
  };

  const handleManualCompletion = async () => {
    if (!lesson || lesson.locked || saving) return;
    setSaving(true);
    setError('');
    try {
      const lessonId = lesson.lessonId || lesson.id;
      await updateLessonProgress(courseId, lessonId, !lesson.completed);
      await loadCourse(lessonId);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to update lesson progress.'));
    } finally { setSaving(false); }
  };

  if (loading) return <StudentPageShell><div className="animate-pulse space-y-5"><div className="h-4 w-32 rounded bg-slate-200" /><div className="h-9 w-2/3 rounded bg-slate-200" /><div className="grid gap-6 lg:grid-cols-[300px_1fr]"><div className="h-[540px] rounded-2xl bg-slate-200" /><div className="h-[540px] rounded-2xl bg-slate-200" /></div></div></StudentPageShell>;
  if (!course) return <StudentPageShell><Link to="/student/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to courses</Link><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">{error || 'Course not found.'}</div></StudentPageShell>;

  return (
    <StudentPageShell>
      <Link to="/student/courses" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to courses</Link>
      <StudentPageHeader title={course.title} subtitle={`${course.category} • ${course.level}`} />
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm leading-6 text-slate-600">{course.description}</p><p className="mt-2 text-xs font-medium text-slate-500">{completedLessons}/{lessons.length} lessons completed{course.duration ? ` • ${course.duration}` : ''}</p></div><div className="w-full max-w-xs"><div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600"><span>Course progress</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div></div></div></div>
      {error && <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"><span>{error}</span><button type="button" onClick={() => loadCourse(selectedLessonId)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"><RefreshCw size={13} /> Retry</button></div>}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-4 py-4"><h2 className="text-sm font-semibold text-slate-900">Course content</h2><p className="mt-1 text-xs text-slate-500">Complete lessons in sequence to unlock the next ones.</p></div><div className="max-h-[70vh] overflow-y-auto p-2">{course.modules.map((module) => {const moduleLessons = Array.isArray(module.lessons) ? module.lessons : []; const expanded = Boolean(expandedModules[module.id]); const moduleCompleted = moduleLessons.filter((item) => item.completed).length; return <div key={module.id} className="mb-1 overflow-hidden rounded-xl border border-slate-100"><button type="button" onClick={() => setExpandedModules((current) => ({ ...current, [module.id]: !expanded }))} className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-slate-50"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{module.title}</span><span className="mt-0.5 block text-[11px] text-slate-500">{moduleCompleted}/{moduleLessons.length} completed</span></span><div className="flex items-center gap-2">{module.locked && <LessonLockBadge reason="Complete the prerequisite module first." />}{expanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}</div></button>{expanded && <div className="border-t border-slate-100 p-1">{moduleLessons.map((item) => {const selected = Number(item.id) === Number(selectedLessonId); const locked = Boolean(item.locked || module.locked); return <button key={item.id} type="button" disabled={locked} onClick={() => handleSelectLesson(item, module.id)} className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition ${locked ? 'cursor-not-allowed opacity-60' : selected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>{item.completed ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /> : locked ? <LessonLockBadge /> : <PlayCircle size={16} className="mt-0.5 shrink-0 text-slate-400" />}<span className="min-w-0"><span className="block text-xs font-medium">{item.title}</span>{item.duration && <span className="mt-0.5 block text-[10px] text-slate-400">{item.duration}</span>}</span></button>;})}</div>}</div>;})}</div></aside>
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">{lessonLoading ? <div className="animate-pulse space-y-5 p-5"><div className="h-4 w-40 rounded bg-slate-200" /><div className="h-7 w-2/3 rounded bg-slate-200" /><div className="aspect-video rounded-2xl bg-slate-200" /></div> : !lesson ? <div className="grid min-h-[480px] place-items-center p-8 text-center"><div><PlayCircle className="mx-auto mb-3 text-slate-300" size={42} /><h2 className="text-lg font-semibold text-slate-900">Lesson unavailable</h2><p className="mt-1 text-sm text-slate-500">Select an unlocked lesson from the course content panel.</p></div></div> : <><div className="border-b border-slate-100 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{lesson.moduleTitle}</p><div className="mt-1 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold text-slate-900">{lesson.title}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{lesson.progressPercent || 0}% watched</span></div></div><div className="space-y-5 p-5"><VideoPlayer src={lesson.videoUrl} title={lesson.title} initialWatchedSeconds={lesson.watchedSeconds || 0} seekTo={seekTo} onProgress={handleWatchProgress} onTimeChange={(value) => setCurrentTime(value)} /><div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-slate-900">{lesson.completed ? 'Lesson completed' : 'Keep going'}</p><p className="mt-1 text-xs text-slate-500">{lesson.completed ? 'You can revisit this lesson whenever you need a refresher.' : 'Watching at least 80% automatically completes the lesson.'}</p></div><button type="button" onClick={handleManualCompletion} disabled={saving} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${lesson.completed ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><CheckCircle2 size={16} />{saving ? 'Saving...' : lesson.completed ? 'Mark incomplete' : 'Mark complete'}</button></div><ChapterMarkers markers={lesson.chapterMarkers} currentTime={currentTime} onSeek={(timestamp) => { setCurrentTime(timestamp); setSeekTo(timestamp); }} /><TranscriptViewer transcriptUrl={lesson.transcriptUrl} currentTime={currentTime} onSeek={(timestamp) => { setCurrentTime(timestamp); setSeekTo(timestamp); }} /><LessonNotes lessonId={lesson.lessonId || lesson.id} currentTime={currentTime} onSeek={(timestamp) => { setCurrentTime(timestamp); setSeekTo(timestamp); }} /><ResourceLibrary resources={lesson.resources} /></div></>}</section>
      </div>
    </StudentPageShell>
  );
}
