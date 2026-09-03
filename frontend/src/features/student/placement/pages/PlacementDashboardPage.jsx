import { useCallback, useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarClock, CheckCircle2, Plus, RefreshCw, Target, TrendingUp, XCircle } from 'lucide-react';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import {
  createApplication,
  getPlacementDashboard,
  updateApplicationStatus,
  withdrawApplication,
} from '../services/placementService';

const STATUS_LABELS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  ASSESSMENT: 'Assessment',
  TECHNICAL_INTERVIEW: 'Technical interview',
  HR_INTERVIEW: 'HR interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

const STATUS_STYLES = {
  APPLIED: 'bg-blue-50 text-blue-700 ring-blue-100',
  SHORTLISTED: 'bg-violet-50 text-violet-700 ring-violet-100',
  ASSESSMENT: 'bg-amber-50 text-amber-700 ring-amber-100',
  TECHNICAL_INTERVIEW: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  HR_INTERVIEW: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  SELECTED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-100',
  WITHDRAWN: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const emptyForm = { companyName: '', jobTitle: '', jobId: '', notes: '' };

export default function PlacementDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPlacementDashboard();
      setDashboard(response?.data ?? response);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load placement data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const applications = dashboard?.applications || [];
  const stats = dashboard?.applicationStatistics || {};
  const interviews = dashboard?.upcomingInterviews || [];
  const skills = dashboard?.skillReadiness || [];
  const recommendations = dashboard?.careerRecommendations || [];
  const analytics = dashboard?.analytics || {};

  const highPriorityGaps = useMemo(
    () => skills.filter((skill) => skill.gap > 0).slice(0, 6),
    [skills],
  );

  const submitApplication = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await createApplication(form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage('Application added to your placement tracker.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to create application.');
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (applicationId, status) => {
    setActionId(applicationId);
    setError('');
    setMessage('');
    try {
      await updateApplicationStatus(applicationId, status);
      setMessage('Application status updated.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to update application.');
    } finally {
      setActionId(null);
    }
  };

  const withdraw = async (applicationId) => {
    setActionId(applicationId);
    setError('');
    setMessage('');
    try {
      await withdrawApplication(applicationId);
      setMessage('Application withdrawn.');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to withdraw application.');
    } finally {
      setActionId(null);
    }
  };

  if (loading && !dashboard) {
    return (
      <StudentPageShell>
        <StudentPageHeader title="Placement" subtitle="Track applications, interviews, skill gaps and your next career actions." />
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />)}
        </div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <StudentPageHeader
        title="Placement"
        subtitle="Track applications, interviews, skill gaps and your next career actions."
        actions={(
          <div className="flex items-center gap-2">
            <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button type="button" onClick={() => setShowForm((open) => !open)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              <Plus size={16} /> Track application
            </button>
          </div>
        )}
      />

      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      {showForm && (
        <form onSubmit={submitApplication} className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Track a new application</h2>
              <p className="mt-1 text-xs text-slate-500">Keep the tracker aligned with the actual application state.</p>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close application form"><XCircle size={18} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company" value={form.companyName} onChange={(value) => setForm((current) => ({ ...current, companyName: value }))} required />
            <Field label="Job title" value={form.jobTitle} onChange={(value) => setForm((current) => ({ ...current, jobTitle: value }))} required />
            <Field label="Job ID" value={form.jobId} onChange={(value) => setForm((current) => ({ ...current, jobId: value }))} />
            <Field label="Notes" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{submitting ? 'Adding…' : 'Add application'}</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<BriefcaseBusiness size={18} />} label="Applications" value={stats.total || 0} hint={`${stats.rejected || 0} rejected`} />
        <StatCard icon={<Target size={18} />} label="Shortlisted" value={stats.shortlisted || 0} hint={`${analytics?.conversionRates?.shortlistConversionRate || 0}% shortlist conversion`} />
        <StatCard icon={<CheckCircle2 size={18} />} label="Selected" value={stats.selected || 0} hint={`${analytics?.conversionRates?.selectionConversionRate || 0}% selection conversion`} />
        <StatCard icon={<CalendarClock size={18} />} label="Upcoming interviews" value={interviews.length} hint={`${dashboard?.interviewStatistics?.completed || 0} completed`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="text-base font-semibold text-slate-900">Application tracker</h2><p className="mt-1 text-xs text-slate-500">Your latest placement applications.</p></div>
            <span className="text-xs font-semibold text-slate-400">{applications.length} shown</span>
          </div>
          {applications.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">No applications tracked yet. Use “Track application” to start.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 8).map((application) => (
                <div key={application.applicationId} className="px-5 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{application.jobTitle}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_STYLES[application.status] || STATUS_STYLES.APPLIED}`}>{STATUS_LABELS[application.status] || application.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{application.companyName}</p>
                      <p className="mt-1 text-xs text-slate-400">Applied {formatDate(application.appliedDate)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {application.status === 'APPLIED' && <button type="button" disabled={actionId === application.applicationId} onClick={() => changeStatus(application.applicationId, 'SHORTLISTED')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Mark shortlisted</button>}
                      {!['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(application.status) && <button type="button" disabled={actionId === application.applicationId} onClick={() => withdraw(application.applicationId)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">Withdraw</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-base font-semibold text-slate-900">Upcoming interviews</h2><p className="mt-1 text-xs text-slate-500">Placement interview schedule.</p></div>
          {interviews.length === 0 ? <div className="px-5 py-12 text-center text-sm text-slate-500">No upcoming placement interviews.</div> : <div className="divide-y divide-slate-100">{interviews.map((interview) => <div key={interview.interviewId} className="px-5 py-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{interview.companyName}</p><p className="mt-1 text-xs text-slate-500">{interview.jobTitle || interview.type}</p><p className="mt-2 text-xs font-medium text-slate-600">{formatDate(interview.dateTime)}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${interview.status === 'SCHEDULED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{interview.status}</span></div></div>)}</div>}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-base font-semibold text-slate-900">Skill gaps</h2><p className="mt-1 text-xs text-slate-500">Prioritised areas where your current score is below target.</p></div><TrendingUp size={18} className="text-blue-600" /></div>
          {highPriorityGaps.length === 0 ? <div className="px-5 py-12 text-center text-sm text-slate-500">No active skill gaps recorded.</div> : <div className="divide-y divide-slate-100">{highPriorityGaps.map((skill) => <div key={skill.id} className="px-5 py-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{skill.skillName}</p><p className="mt-1 text-xs text-slate-500">{skill.category} · {skill.priority} priority</p></div><p className="text-sm font-bold text-slate-900">{skill.currentScore}<span className="text-slate-400">/{skill.targetScore}</span></p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(skill.currentScore, 100)}%` }} /></div><p className="mt-1 text-[11px] text-slate-400">Gap: {skill.gap} points</p></div>)}</div>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-base font-semibold text-slate-900">Career recommendations</h2><p className="mt-1 text-xs text-slate-500">Concrete actions based on your tracked placement data.</p></div>
          {recommendations.length === 0 ? <div className="px-5 py-12 text-center text-sm text-slate-500">No recommendations have been generated yet.</div> : <div className="space-y-3 p-5">{recommendations.slice(0, 5).map((recommendation) => <div key={recommendation.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{recommendation.title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{recommendation.reason}</p></div><span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{recommendation.priority}</span></div><p className="mt-3 text-xs font-semibold text-blue-700">Next: {recommendation.recommendedAction}</p></div>)}</div>}
        </section>
      </div>
    </StudentPageShell>
  );
}

function Field({ label, value, onChange, required = false }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}{required && <span className="text-rose-500"> *</span>}</span><input value={value} onChange={(event) => onChange(event.target.value)} required={required} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>;
}

function StatCard({ icon, label, value, hint }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="rounded-xl bg-blue-50 p-2 text-blue-600">{icon}</div><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Placement</span></div><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div>;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}
