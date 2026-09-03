import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Award, BarChart3, CalendarDays, ChevronLeft, ChevronRight, Clock3, Medal, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import { getPerformance, getSubmissionHistory } from '../../../services/performance.service';

const ACTIVITY_META = {
  all: { label: 'All activity' },
  assessment: { label: 'Assessments' },
  assignment: { label: 'Assignments' },
  coding: { label: 'Coding challenges' },
  project: { label: 'Projects' },
};

export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [history, setHistory] = useState({ submissions: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPerformance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getPerformance();
      setPerformance(result?.performance || result?.data || result);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load performance analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const result = await getSubmissionHistory({ type, page, limit: 10 });
      setHistory({
        submissions: result?.submissions || [],
        pagination: result?.pagination || { page, totalPages: 1, total: 0 },
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load submission history.');
    } finally {
      setHistoryLoading(false);
    }
  }, [page, type]);

  useEffect(() => { loadPerformance(); }, [loadPerformance]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const moduleAverage = useMemo(() => {
    const modules = performance?.moduleProgress || [];
    return modules.length ? Math.round(modules.reduce((sum, module) => sum + Number(module.progress || 0), 0) / modules.length) : 0;
  }, [performance]);

  const trend = performance?.improvementTrend || [];
  const chartPoints = buildChartPoints(trend.map((item) => Number(item.avgScore || 0)));

  if (loading && !performance) {
    return (
      <StudentPageShell>
        <StudentPageHeader title="Performance" subtitle="A transparent view of your learning performance and progress." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />)}</div>
        <div className="mt-6 h-80 animate-pulse rounded-2xl bg-slate-200" />
      </StudentPageShell>
    );
  }

  const activity = performance?.activityScores || {};
  const attendance = Number(performance?.attendancePercent || 0);
  const rank = performance?.batchRank;
  const totalStudents = Number(performance?.totalStudents || 0);

  return (
    <StudentPageShell>
      <StudentPageHeader
        title="Performance"
        subtitle="A transparent view of your learning performance and progress."
        actions={(
          <button type="button" onClick={loadPerformance} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        )}
      />

      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Award size={18} />} label="Overall score" value={`${Number(performance?.overallScore || 0).toFixed(1)}%`} hint="Across available graded activities" />
        <MetricCard icon={<BarChart3 size={18} />} label="Course progress" value={`${moduleAverage}%`} hint={`${(performance?.moduleProgress || []).length} published courses`} />
        <MetricCard icon={<CalendarDays size={18} />} label="Attendance" value={`${attendance.toFixed(1)}%`} hint={`${performance?.sessionsAttended || 0} of ${performance?.totalSessions || 0} attended`} />
        <MetricCard icon={<Zap size={18} />} label="XP" value={performance?.xpTotal || 0} hint="Earned from tracked learning activity" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-base font-semibold text-slate-900">Activity score breakdown</h2><p className="mt-1 text-xs text-slate-500">Average score and tracked attempt volume by activity type.</p></div>
            <Activity size={18} className="text-blue-600" />
          </div>
          <div className="mt-6 space-y-5">
            <ActivityBar label="Assessments" score={activity.quizzes?.avgScore} meta={`${activity.quizzes?.attempted || 0} attempts`} />
            <ActivityBar label="Assignments" score={activity.assignments?.avgScore} meta={`${activity.assignments?.attempted || 0} graded`} />
            <ActivityBar label="Coding challenges" score={activity.codingChallenges?.avgScore} meta={`${activity.codingChallenges?.attempted || 0} submissions`} />
            <ActivityBar label="Projects" score={activity.projects?.avgScore} meta={activity.projects?.submitted ? 'Evaluated submission' : 'No evaluated submission'} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-slate-900">Batch standing</h2><p className="mt-1 text-xs text-slate-500">Current course-progress ranking among active students.</p></div><Medal size={18} className="text-amber-500" /></div>
          <div className="mt-7 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-blue-100 bg-blue-50"><div><p className="text-3xl font-bold text-blue-700">{rank || '—'}</p><p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">Rank</p></div></div>
            <p className="mt-4 text-sm font-semibold text-slate-900">{performance?.batchPercentile || 0}th percentile</p>
            <p className="mt-1 text-xs text-slate-500">{totalStudents ? `Out of ${totalStudents} active students` : 'Ranking will appear as cohort data grows'}</p>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-slate-900">Improvement trend</h2><p className="mt-1 text-xs text-slate-500">Assessment performance by week over the last 12 weeks.</p></div><TrendingUp size={18} className="text-emerald-600" /></div>
          {trend.length === 0 ? <div className="flex h-64 items-center justify-center text-sm text-slate-400">Not enough graded activity to plot a trend.</div> : <div className="mt-5"><svg viewBox="0 0 700 280" className="h-64 w-full overflow-visible" role="img" aria-label="Performance improvement trend"><line x1="48" y1="25" x2="48" y2="235" stroke="currentColor" className="text-slate-200" /><line x1="48" y1="235" x2="680" y2="235" stroke="currentColor" className="text-slate-200" />{[0,25,50,75,100].map((value) => { const y = 235 - (value / 100) * 210; return <g key={value}><line x1="48" y1={y} x2="680" y2={y} stroke="currentColor" className="text-slate-100" /><text x="5" y={y + 4} fontSize="11" fill="currentColor" className="text-slate-400">{value}</text></g>; })}<polyline fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-600" strokeLinecap="round" strokeLinejoin="round" points={chartPoints.map((point) => `${point.x},${point.y}`).join(' ')} />{chartPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="5" fill="currentColor" className="text-blue-600" />)}<text x="48" y="260" fontSize="11" fill="currentColor" className="text-slate-400">{trend[0]?.week}</text><text x="680" y="260" textAnchor="end" fontSize="11" fill="currentColor" className="text-slate-400">{trend[trend.length - 1]?.week}</text></svg></div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-slate-900">Course progress</h2><p className="mt-1 text-xs text-slate-500">Progress across the current published learning catalogue.</p></div><Clock3 size={18} className="text-violet-600" /></div>
          <div className="mt-5 space-y-4">{(performance?.moduleProgress || []).length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No course progress is available yet.</p> : (performance.moduleProgress || []).slice(0, 6).map((module) => <div key={module.courseId}><div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium text-slate-800">{module.title}</span><span className="text-xs font-bold text-slate-500">{module.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, module.progress))}%` }} /></div><p className="mt-1 text-[11px] text-slate-400">{module.completedLessons} of {module.totalLessons} lessons</p></div>)}</div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="text-base font-semibold text-slate-900">Submission history</h2><p className="mt-1 text-xs text-slate-500">Drill down into recent graded activity.</p></div>
          <div className="flex flex-wrap items-center gap-2">{Object.entries(ACTIVITY_META).map(([key, value]) => <button key={key} type="button" onClick={() => { setType(key); setPage(1); }} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${type === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{value.label}</button>)}</div>
        </div>
        {historyLoading ? <div className="space-y-2 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}</div> : history.submissions.length === 0 ? <div className="px-5 py-12 text-center text-sm text-slate-400">No submission history for this filter.</div> : <div className="divide-y divide-slate-100">{history.submissions.map((item) => <div key={`${item.type}-${item.submissionId}`} className="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_160px_100px_170px] sm:items-center"><div><p className="text-sm font-semibold text-slate-900">{item.activityTitle}</p><p className="mt-1 text-xs capitalize text-slate-400">{item.type}</p></div><span className="text-xs text-slate-500">{formatDate(item.submittedAt)}</span><span className={`text-sm font-bold ${item.score == null ? 'text-slate-400' : item.score >= 80 ? 'text-emerald-600' : item.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{item.score == null ? '—' : `${item.score}%`}</span><span className="text-xs font-medium text-slate-400">Tracked performance activity</span></div>)}</div>}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3"><span className="text-xs text-slate-500">Page {history.pagination?.page || page} of {Math.max(1, history.pagination?.totalPages || 1)}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || historyLoading} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"><ChevronLeft size={14} /> Previous</button><button type="button" onClick={() => setPage((value) => value + 1)} disabled={historyLoading || page >= (history.pagination?.totalPages || 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40">Next <ChevronRight size={14} /></button></div></div>
      </section>
    </StudentPageShell>
  );
}

function MetricCard({ icon, label, value, hint }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-blue-50 p-2 text-blue-600">{icon}</div><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Performance</span></div><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div>;
}

function ActivityBar({ label, score, meta }) {
  const numericScore = score == null ? null : Number(score);
  return <div><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="mt-1 text-xs text-slate-400">{meta}</p></div><p className="text-sm font-bold text-slate-900">{numericScore == null ? '—' : `${numericScore.toFixed(1)}%`}</p></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${numericScore == null ? 0 : Math.min(100, Math.max(0, numericScore))}%` }} /></div></div>;
}

function buildChartPoints(values) {
  if (!values.length) return [];
  const width = 632;
  const height = 210;
  const left = 48;
  const top = 25;
  const usableWidth = width;
  const step = values.length === 1 ? 0 : usableWidth / (values.length - 1);
  return values.map((value, index) => ({ x: left + index * step, y: top + height - (Math.min(100, Math.max(0, value)) / 100) * height }));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
