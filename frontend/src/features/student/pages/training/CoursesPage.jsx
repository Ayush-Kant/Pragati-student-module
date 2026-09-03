import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock3, Search, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import EmptyState from '../../components/common/EmptyState';
import { getCourses } from '../../services/studentCourse.service';

const ProgressRing = ({ value }) => (
  <div
    className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full"
    style={{
      background: `conic-gradient(#2563eb ${Math.min(Math.max(value, 0), 100) * 3.6}deg, #e2e8f0 0deg)`,
    }}
  >
    <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-bold text-slate-900">
      {value}%
    </div>
  </div>
);

export default function CoursesPage() {
  const navigate = useNavigate();
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
        if (!active) return;
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || 'Unable to load courses.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;
    return courses.filter((course) =>
      `${course.title} ${course.category} ${course.level} ${course.description || ''}`
        .toLowerCase()
        .includes(query),
    );
  }, [courses, search]);

  const averageProgress = useMemo(() => {
    if (!courses.length) return 0;
    return Math.round(courses.reduce((sum, course) => sum + Number(course.progress || 0), 0) / courses.length);
  }, [courses]);

  if (loading) {
    return (
      <StudentPageShell>
        <div className="animate-pulse space-y-6">
          <div className="h-9 w-64 rounded-lg bg-slate-200" />
          <div className="h-12 rounded-xl bg-slate-200" />
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-56 rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
      </StudentPageShell>
    );
  }

  if (error) {
    return (
      <StudentPageShell>
        <StudentPageHeader title="Courses" subtitle="Continue learning through your enrolled training programmes." />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <StudentPageHeader
        title="Courses"
        subtitle="Continue learning through your enrolled training programmes."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <BookOpen size={20} className="mb-3 text-blue-600" />
          <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
          <p className="text-xs font-medium text-slate-500">Active courses</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Trophy size={20} className="mb-3 text-emerald-600" />
          <p className="text-2xl font-bold text-slate-900">{courses.filter((course) => Number(course.progress) === 100).length}</p>
          <p className="text-xs font-medium text-slate-500">Completed</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Clock3 size={20} className="mb-3 text-indigo-600" />
          <p className="text-2xl font-bold text-slate-900">{averageProgress}%</p>
          <p className="text-xs font-medium text-slate-500">Average progress</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="There are no courses matching your current search."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {course.category}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">{course.title}</h2>
                </div>
                <ProgressRing value={Number(course.progress || 0)} />
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                {course.description || 'Continue through the lessons and complete each module at your own pace.'}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{course.level}</span>
                {course.duration && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{course.duration}</span>
                )}
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {course.completedLessons || 0}/{course.totalLessons || 0} lessons
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/student/courses/${course.id}`)}
                className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue course
              </button>
            </article>
          ))}
        </div>
      )}
    </StudentPageShell>
  );
}
