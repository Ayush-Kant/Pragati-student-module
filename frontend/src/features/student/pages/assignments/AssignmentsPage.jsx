import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getAssignmentStatistics,
  getAssignmentSubmissions,
  getAssignments,
} from '../../services/assignment.service';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import EmptyState from '../../components/common/EmptyState';

const formatDate = (value) => {
  if (!value) return 'No deadline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No deadline';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const isOverdue = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
};

const statusLabel = (assignment, submission) => {
  if (submission?.status === 'submitted') return 'Submitted';
  if (assignment.status === 'closed') return 'Closed';
  if (isOverdue(assignment.dueDate)) return 'Overdue';
  return 'Pending';
};

const statusStyles = {
  Submitted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-blue-50 text-blue-700 border-blue-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [serverStats, setServerStats] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [assignmentData, submissionData, statistics] = await Promise.all([
          getAssignments(),
          getAssignmentSubmissions(),
          getAssignmentStatistics(),
        ]);
        if (!active) return;
        setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
        setSubmissions(Array.isArray(submissionData) ? submissionData : []);
        setServerStats(statistics || null);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || 'Unable to load assignments.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const submissionByAssignment = useMemo(
    () => new Map(submissions.map((item) => [String(item.assignmentId), item])),
    [submissions],
  );

  const enriched = useMemo(
    () => assignments.map((assignment) => {
      const submission = submissionByAssignment.get(String(assignment.id)) || assignment.submission || null;
      return { ...assignment, submission, studentStatus: statusLabel(assignment, submission) };
    }),
    [assignments, submissionByAssignment],
  );

  const counts = useMemo(() => {
    const local = enriched.reduce((acc, item) => {
      acc.all += 1;
      acc[item.studentStatus.toLowerCase()] = (acc[item.studentStatus.toLowerCase()] || 0) + 1;
      return acc;
    }, { all: 0, pending: 0, submitted: 0, overdue: 0, closed: 0 });

    if (!serverStats) return local;

    const total = Number(serverStats.total ?? local.all);
    const submitted = Number(serverStats.submitted ?? local.submitted);
    const closed = Number(serverStats.closed ?? local.closed);
    return {
      ...local,
      all: total,
      submitted,
      closed,
      pending: Math.max(0, total - submitted - closed),
    };
  }, [enriched, serverStats]);

  const filtered = useMemo(() => enriched.filter((assignment) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${assignment.title} ${assignment.subject} ${assignment.description || ''}`.toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || assignment.studentStatus.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  }), [enriched, filter, search]);

  if (loading) {
    return (
      <StudentPageShell>
        <div className="animate-pulse space-y-6">
          <div className="h-9 w-56 rounded-lg bg-slate-200" />
          <div className="h-12 rounded-xl bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 rounded-2xl bg-slate-200" />)}
          </div>
        </div>
      </StudentPageShell>
    );
  }

  if (error) {
    return (
      <StudentPageShell>
        <StudentPageHeader title="Assignments" subtitle="Stay on top of your pending and submitted coursework." />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <StudentPageHeader title="Assignments" subtitle="Stay on top of your pending and submitted coursework." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Pending', counts.pending, Clock3],
          ['Submitted', counts.submitted, CheckCircle2],
          ['Overdue', counts.overdue, CalendarDays],
          ['Total', counts.all, FileText],
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Icon className="mb-2 text-blue-600" size={18} />
            <div className="text-2xl font-semibold text-slate-900">{value}</div>
            <div className="text-xs font-medium text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignments..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'submitted', 'overdue', 'closed'].map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition ${filter === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
              {item} {item !== 'all' ? `(${counts[item] || 0})` : `(${counts.all})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No assignments found" description="There are no assignments matching the current filters." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((assignment) => (
            <article key={assignment.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">{assignment.subject}</p>
                  <h2 className="truncate text-lg font-semibold text-slate-900">{assignment.title}</h2>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[assignment.studentStatus]}`}>
                  {assignment.studentStatus}
                </span>
              </div>
              <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600">{assignment.description || 'No description provided.'}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />Due {formatDate(assignment.dueDate)}</span>
                <span>{assignment.totalMarks} marks</span>
              </div>
              <button type="button" onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {assignment.submission?.status === 'submitted' ? 'Review submission' : 'View assignment'}
              </button>
            </article>
          ))}
        </div>
      )}
    </StudentPageShell>
  );
}
