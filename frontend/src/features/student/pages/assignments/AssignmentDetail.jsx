import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, FileText, Send, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAssignmentById,
  getAssignmentSubmission,
  submitAssignment,
} from '../../services/assignment.service';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';

const formatDate = (value) => {
  if (!value) return 'No deadline';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'No deadline'
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatSubmittedAt = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
};

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [assignmentData, submissionData] = await Promise.all([
          getAssignmentById(id),
          getAssignmentSubmission(id),
        ]);
        if (!active) return;
        setAssignment(assignmentData);
        setSubmission(submissionData);
        setContent(submissionData?.content || '');
        setFileUrl(submissionData?.fileUrl || '');
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || 'Unable to load this assignment.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!content.trim() && !fileUrl.trim()) {
      setError('Add a written response or a submission file URL before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitAssignment(id, {
        ...(content.trim() ? { content: content.trim() } : {}),
        ...(fileUrl.trim() ? { fileUrl: fileUrl.trim() } : {}),
      });
      setSubmission(result);
      setMessage('Assignment submitted successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to submit the assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentPageShell>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="h-9 w-2/3 rounded-lg bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
        </div>
      </StudentPageShell>
    );
  }

  if (error && !assignment) {
    return (
      <StudentPageShell>
        <button
          type="button"
          onClick={() => navigate('/student/assignments')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} /> Back to assignments
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </StudentPageShell>
    );
  }

  const closed = assignment.status === 'closed';
  const submitted = submission?.status === 'submitted';

  return (
    <StudentPageShell>
      <Link
        to="/student/assignments"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={16} /> Back to assignments
      </Link>

      <StudentPageHeader title={assignment.title} subtitle={assignment.subject} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} /> Due {formatDate(assignment.dueDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText size={14} /> {assignment.totalMarks} marks
              </span>
            </div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Instructions</h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {assignment.description || 'No additional instructions were provided for this assignment.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Your submission</h2>
                <p className="mt-1 text-xs text-slate-500">Save a written response or provide a file URL.</p>
              </div>
              {submitted && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} /> Submitted
                </span>
              )}
            </div>

            {error && assignment && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="assignment-content">
              Response
            </label>
            <textarea
              id="assignment-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={5000}
              rows={9}
              disabled={closed || submitting}
              placeholder="Write your solution, explanation, or response here..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
            <div className="mt-1 text-right text-[11px] text-slate-400">{content.length}/5000</div>

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700" htmlFor="assignment-file">
              Submission file URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <UploadCloud size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="assignment-file"
                value={fileUrl}
                onChange={(event) => setFileUrl(event.target.value)}
                disabled={closed || submitting}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={closed || submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send size={16} />
              {submitting ? 'Submitting...' : submitted ? 'Update submission' : 'Submit assignment'}
            </button>
            {closed && (
              <p className="mt-3 text-center text-xs text-slate-500">
                This assignment is closed and no longer accepts submissions.
              </p>
            )}
            {submission?.submittedAt && (
              <p className="mt-3 text-center text-xs text-slate-400">
                Last submitted {formatSubmittedAt(submission.submittedAt)}
              </p>
            )}
          </form>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Assignment status</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Course / subject</span>
              <span className="font-medium text-slate-900">{assignment.subject}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Maximum marks</span>
              <span className="font-medium text-slate-900">{assignment.totalMarks}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Deadline</span>
              <span className="text-right font-medium text-slate-900">{formatDate(assignment.dueDate)}</span>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Submission</span>
              <p className="mt-1 font-medium text-slate-900">{submitted ? 'Submitted' : closed ? 'Closed' : 'Not submitted'}</p>
            </div>
          </div>
        </aside>
      </div>
    </StudentPageShell>
  );
}
