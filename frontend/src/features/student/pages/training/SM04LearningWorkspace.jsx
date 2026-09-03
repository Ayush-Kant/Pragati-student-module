import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, PlayCircle, Search, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import EmptyState from '../../components/common/EmptyState';
import { getCourses } from '../../services/studentCourse.service';

const clamp = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const getLessons = (course) =>
  (course?.modules || []).flatMap((module) =>
    (module?.lessons || []).map((lesson) => ({ ...lesson, moduleTitle: module.title }))
  );

const getNextLesson = (course) => {
  const lessons = getLessons(course);
  return lessons.find((lesson) => !lesson.locked && !lesson.completed) || lessons.find((lesson) => !lesson.locked) || null;
};

const ProgressBar = ({ value }) => (
  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
    <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${clamp(value)}%` }} />
  </div>
);

const ProgressRing = ({ value }) => {
  const percent = clamp(value);
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-indigo-50">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path className="text-slate-200" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path className="text-indigo-600" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray={`${percent},100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
      </svg>
      <span className="relative text-sm font-bold text-slate-900">{Math.round(percent)}%</span>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, helper, tone = 'indigo' }) {
  const toneClass = tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-700">{label}</div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  );
}

export default function SM04LearningWorkspace() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCourses();
        if (active) setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || err?.message || 'Unable to load learning content.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = !query ? courses : courses.filter((course) =>
      `${course.title} ${course.category} ${course.level} ${course.description || ''}`.toLowerCase().includes(query)
    );
    return result;
  }, [courses, search]);

  const summary = useMemo(() => {
    const totalLessons = courses.reduce((sum, course) => sum + Number(course.totalLessons || 0), 0);
    const completedLessons = courses.reduce((sum, course) => sum + Number(course.completedLessons || 0), 0);
    const completedCourses = courses.filter((course) => clamp(course.progress) >= 100).length;
    const averageProgress = courses.length
      ? Math.round(courses.reduce((sum, course) => sum + clamp(course.progress), 0) / courses.length)
      : 0;
    return { totalLessons, completedLessons, completedCourses, averageProgress };
  }, [courses]);

  const nextCourse = useMemo(() => {
    const inProgress = courses.filter((course) => clamp(course.progress) < 100);
    if (!inProgress.length) return null;
    return inProgress.reduce((best, course) => (clamp(course.progress) > clamp(best?.progress) ? course : best), inProgress[0]);
  }, [courses]);

  const nextLesson = nextCourse ? getNextLesson(nextCourse) : null;

  if (loading) {
    return (
      <StudentPageShell>
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-3"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /></div>
          <div className="grid gap-5 lg:grid-cols-2"><div className="h-64 rounded-2xl bg-slate-200" /><div className="h-64 rounded-2xl bg-slate-200" /></div>
        </div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <StudentPageHeader title="Learning" subtitle="Build your skills through structured courses, lessons, resources and practice." />

      {error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

      {nextCourse && nextLesson ? (
        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300"><Sparkles className="h-4 w-4" /> Continue learning</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight">{nextCourse.title}</h2>
              <p className="mt-1 text-sm text-slate-300">Next up: {nextLesson.title}</p>
              <div className="mt-5 max-w-xl"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300"><span>Course progress</span><span>{Math.round(clamp(nextCourse.progress))}%</span></div><ProgressBar value={nextCourse.progress} /></div>
            </div>
            <Link to={`/student/courses/${nextCourse.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">Resume course <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600"><BookOpen className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-slate-900">Your learning space</h2><p className="mt-1 text-sm text-slate-600">{courses.length ? 'All available courses are complete. Revisit any course for a refresher.' : 'Courses will appear here once learning content is assigned to you.'}</p></div></div>
        </section>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Courses" value={courses.length} helper="Published learning paths" />
        <StatCard icon={CheckCircle2} label="Lessons completed" value={summary.completedLessons} helper={`${summary.totalLessons} lessons available`} tone="emerald" />
        <StatCard icon={Trophy} label="Average progress" value={`${summary.averageProgress}%`} helper={`${summary.completedCourses} course${summary.completedCourses === 1 ? '' : 's'} completed`} />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-bold text-slate-900">My courses</h2><p className="mt-1 text-xs text-slate-500">Follow each course in sequence to unlock the next lessons.</p></div>
        <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={courses.length ? 'No courses match your search' : 'No courses available'} description={courses.length ? 'Try another course title, category or level.' : 'Published courses assigned to your student account will appear here.'} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((course) => {
            const progress = clamp(course.progress);
            return (
              <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0"><div className="text-xs font-bold uppercase tracking-wide text-indigo-600">{course.category || 'Learning path'}</div><h3 className="mt-1 text-xl font-black text-slate-900">{course.title}</h3><div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-100 px-2.5 py-1">{course.level || 'All levels'}</span>{course.duration ? <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.duration}</span> : null}</div></div>
                  <ProgressRing value={progress} />
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{course.description || 'Work through the structured lessons and complete the modules in order.'}</p>
                <div className="mt-5"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600"><span>Progress</span><span>{course.completedLessons || 0}/{course.totalLessons || 0} lessons</span></div><ProgressBar value={progress} /></div>
                <div className="mt-5 flex items-center justify-between gap-3"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${progress >= 100 ? 'text-emerald-600' : 'text-slate-500'}`}>{progress >= 100 ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}{progress >= 100 ? 'Completed' : 'In progress'}</span><Link to={`/student/courses/${course.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700">{progress >= 100 ? 'Review course' : 'Continue'} <ArrowRight className="h-3.5 w-3.5" /></Link></div>
              </article>
            );
          })}
        </div>
      )}
    </StudentPageShell>
  );
}
