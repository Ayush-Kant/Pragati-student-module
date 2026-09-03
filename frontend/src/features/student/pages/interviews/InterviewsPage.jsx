import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, ExternalLink, Video } from 'lucide-react';
import api from '../../../../services/api';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';

const formatDate = (value) => {
  if (!value) return 'Schedule pending';
  return new Date(value).toLocaleString();
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/student/interviews');
      setInterviews(response.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to load interviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirm = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/student/interviews/${id}/confirm`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to confirm interview.');
    } finally {
      setBusyId(null);
    }
  };

  const join = async (id) => {
    setBusyId(id);
    try {
      const response = await api.post(`/student/interviews/${id}/join`);
      const link = response.data?.data?.meetingLink;
      if (link) window.open(link, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to join interview.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <StudentPageShell>
      <StudentPageHeader
        title="Interviews"
        subtitle="Track interview invitations, confirmations, outcomes and joining details."
      />

      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading interviews...</div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <CalendarClock className="mx-auto mb-3 text-slate-300" size={40} />
          <h2 className="font-semibold text-slate-900">No interviews scheduled</h2>
          <p className="mt-1 text-sm text-slate-500">Interview invitations will appear here once you are shortlisted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <article key={interview.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {interview.interviewType || 'Interview'}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{interview.title || 'Interview'}</h2>
                  <p className="mt-1 text-sm text-slate-500">{interview.companyName || interview.driveTitle || 'Recruitment interview'}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">{formatDate(interview.scheduledAt)}</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                  {interview.status || 'scheduled'}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {(interview.status === 'scheduled' || interview.status === 'invited') && (
                  <button
                    type="button"
                    onClick={() => confirm(interview.id)}
                    disabled={busyId === interview.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} /> Confirm
                  </button>
                )}
                {interview.canJoin && (
                  <button
                    type="button"
                    onClick={() => join(interview.id)}
                    disabled={busyId === interview.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <Video size={16} /> Join interview
                  </button>
                )}
                {interview.meetingLink && !interview.canJoin && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <ExternalLink size={16} /> Meeting link
                  </a>
                )}
              </div>

              {interview.result && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold">Outcome:</span> {interview.result}
                  {interview.feedback && <p className="mt-1 text-slate-500">{interview.feedback}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </StudentPageShell>
  );
}
