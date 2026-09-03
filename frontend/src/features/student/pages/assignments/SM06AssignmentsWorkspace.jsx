import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import EmptyState from '../../components/common/EmptyState';
import { getAssignments, getAssignmentStatistics } from '../../services/assignment.service';

const formatDate = (value) => {
  if (!value) return 'No deadline';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 'No deadline' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};
const normalized = (value) => String(value || '').toLowerCase();
const getStatus = (assignment) => {
  // A released grade is the most informative student-facing state.
  if (assignment?.grade) return 'Graded';
  const submissionStatus = normalized(assignment?.submission?.status);
  if (submissionStatus === 'submitted' || submissionStatus === 'late') return 'Submitted';
  if (normalized(assignment?.status) === 'closed') return 'Closed';
  if (assignment?.dueDate && new Date(`${assignment.dueDate}T23:59:59`).getTime() < Date.now()) return 'Overdue';
  return 'Pending';
};

export default function SM06AssignmentsWorkspace() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, statistics] = await Promise.all([getAssignments(), getAssignmentStatistics()]);
      setAssignments(Array.isArray(data) ? data : []);
      setStats(statistics || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([getAssignments(), getAssignmentStatistics()])
      .then(([data, statistics]) => {
        if (!active) return;
        setAssignments(Array.isArray(data) ? data : []);
        setStats(statistics || null);
      })
      .catch((err) => active && setError(err?.response?.data?.message || err?.message || 'Unable to load assignments.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const enriched = useMemo(() => assignments.map((assignment) => ({ ...assignment, studentStatus: getStatus(assignment) })), [assignments]);
  const filtered = useMemo(() => enriched.filter((assignment) => {
    const text = `${assignment.title} ${assignment.subject} ${assignment.description || ''}`.toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase())) && (filter === 'all' || normalized(assignment.studentStatus) === filter);
  }), [enriched, query, filter]);
  const count = (status) => enriched.filter((item) => item.studentStatus === status).length;

  return (
    <StudentPageShell>
      <StudentPageHeader title="Assignments" subtitle="Complete coursework, submit work, monitor deadlines, and review grades and mentor feedback." />
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[['Pending',count('Pending'),Clock3],['Submitted',count('Submitted'),CheckCircle2],['Graded',count('Graded'),CheckCircle2],['Overdue',count('Overdue'),CalendarDays],['Average',stats?.averageScore ? Number(stats.averageScore).toFixed(1) : '0',FileText]].map(([label,value,Icon])=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon size={18} className="mb-2 text-blue-600"/><div className="text-xl font-black text-slate-900">{value}</div><div className="text-xs font-medium text-slate-500">{label}</div></div>)}
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search assignments..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></div><select value={filter} onChange={(e)=>setFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none">{['all','pending','submitted','graded','overdue','closed'].map((value)=><option key={value} value={value}>{value[0].toUpperCase()+value.slice(1)}</option>)}</select><button type="button" onClick={load} disabled={loading} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Refresh</button></div>
      {loading ? <div className="grid gap-5 lg:grid-cols-2">{Array.from({length:4},(_,i)=><div key={i} className="h-60 animate-pulse rounded-2xl bg-slate-200"/>)}</div> : !filtered.length ? <EmptyState title="No assignments found" description={assignments.length ? 'Try a different search or filter.' : 'Assignments assigned to you will appear here.'}/> : <div className="grid gap-5 lg:grid-cols-2">{filtered.map((assignment)=>{const status=assignment.studentStatus; const overdue=status==='Overdue'; return <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold uppercase tracking-wide text-blue-600">{assignment.subject}</div><h2 className="mt-1 truncate text-lg font-black text-slate-900">{assignment.title}</h2></div><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${status==='Overdue'?'border-red-200 bg-red-50 text-red-700':status==='Submitted'||status==='Graded'?'border-emerald-200 bg-emerald-50 text-emerald-700':status==='Closed'?'border-slate-300 bg-slate-100 text-slate-600':'border-slate-200 bg-slate-50 text-slate-600'}`}>{status}</span></div><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{assignment.description || 'Review the assignment instructions and complete the required work.'}</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/>Due {formatDate(assignment.dueDate)}</span><span className="inline-flex items-center gap-1.5"><FileText size={14}/>{assignment.totalMarks} marks</span></div><div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold"><span className="rounded-full bg-slate-100 px-2.5 py-1">{assignment.submissionType || 'both'} submission</span><span className="rounded-full bg-slate-100 px-2.5 py-1">Grace: {assignment.latePolicy?.graceDays || 0} day(s)</span>{assignment.allowResubmission && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">Resubmission enabled</span>}</div>{assignment.grade && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Grade: <strong>{assignment.grade.score}/{assignment.totalMarks}</strong>{assignment.grade.remarks ? ` • ${assignment.grade.remarks}` : ''}</div>}{assignment.feedback && <div className="mt-3 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900"><div className="font-bold">Mentor feedback</div><div className="mt-1 whitespace-pre-wrap">{assignment.feedback.remarks}</div></div>}<button type="button" onClick={()=>navigate(`/student/assignments/${assignment.id}`)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">{status==='Submitted'||status==='Graded'?'Open submission & feedback':overdue?'Submit late work':'Open assignment'}<ArrowRight size={15}/></button></article>})}</div>}
    </StudentPageShell>
  );
}
