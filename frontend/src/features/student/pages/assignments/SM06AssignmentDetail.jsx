import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink, FileText, Link2, Send, UploadCloud } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StudentPageShell from '../../components/common/StudentPageShell';
import StudentPageHeader from '../../components/common/StudentPageHeader';
import { getAssignmentById, getAssignmentSubmission, submitAssignment } from '../../services/assignment.service';

const formatDate = (value) => { if (!value) return 'No deadline'; const d = new Date(value); return Number.isNaN(d.getTime()) ? 'No deadline' : d.toLocaleString(); };
const normalized = (value) => String(value || '').toLowerCase();

export default function SM06AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [externalLink, setExternalLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => { setLoading(true); setError(''); try { const [a,s]=await Promise.all([getAssignmentById(id),getAssignmentSubmission(id)]); setAssignment(a); setSubmission(s); setContent(s?.content || ''); setExternalLink(s?.fileUrl || ''); } catch(err) { setError(err?.response?.data?.message || err?.message || 'Unable to load assignment.'); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[id]);

  const handleSubmit = async (event) => { event.preventDefault(); setError(''); setMessage(''); if(!content.trim()&&!file&&!externalLink.trim()){setError('Add the required response before submitting.');return;} setSubmitting(true); try{const form=new FormData(); if(content.trim())form.append('content',content.trim()); if(externalLink.trim())form.append('fileUrl',externalLink.trim()); if(file)form.append('file',file); await submitAssignment(id,form); setFile(null); setMessage('Assignment submitted successfully.'); await load();}catch(err){setError(err?.response?.data?.message || err?.message || 'Unable to submit assignment.');}finally{setSubmitting(false);} };

  if(loading) return <StudentPageShell><div className="animate-pulse space-y-5"><div className="h-8 w-64 rounded bg-slate-200"/><div className="h-40 rounded-2xl bg-slate-200"/><div className="h-80 rounded-2xl bg-slate-200"/></div></StudentPageShell>;
  if(!assignment) return <StudentPageShell><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error || 'Assignment not found.'}</div></StudentPageShell>;

  const closed = normalized(assignment.status) === 'closed';
  const attemptsUsed = Number(submission?.attemptNumber || 0);
  const canResubmit = Boolean(assignment.allowResubmission) && (!submission || attemptsUsed <= Number(assignment.maxResubmissions || 0));
  const needsFile = assignment.submissionType === 'file' || assignment.submissionType === 'both';
  const needsText = assignment.submissionType === 'text' || assignment.submissionType === 'both';

  return <StudentPageShell>
    <Link to="/student/assignments" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> Back to assignments</Link>
    <StudentPageHeader title={assignment.title} subtitle={assignment.subject}/>
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-3 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/> Due {formatDate(assignment.dueDate)}</span><span className="inline-flex items-center gap-1.5"><FileText size={14}/> {assignment.totalMarks} marks</span><span className="rounded-full bg-slate-100 px-2.5 py-1">{assignment.submissionType || 'both'} submission</span></div>
          <h2 className="mb-3 text-sm font-bold text-slate-900">Problem statement & instructions</h2>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{assignment.description || 'No additional instructions were provided.'}</p>
          {assignment.starterFileUrl && <a href={assignment.starterFileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink size={15}/> Download starter files</a>}
        </div>
        {(assignment.grade || assignment.feedback || submission) && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-base font-bold text-slate-900">Submission result</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Status</div><div className="mt-1 font-bold text-slate-900">{submission?.status || 'Not submitted'}</div></div><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Attempt</div><div className="mt-1 font-bold text-slate-900">{attemptsUsed}{assignment.maxResubmissions ? ` / ${Number(assignment.maxResubmissions)+1}` : ''}</div></div></div>{submission?.lateDays > 0 && <div className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Late by {submission.lateDays} day(s). Penalty applied: {submission.latePenalty}%.</div>}{assignment.grade && <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><strong>Score: {assignment.grade.score}/{assignment.totalMarks}</strong>{assignment.grade.remarks ? ` • ${assignment.grade.remarks}` : ''}</div>}{assignment.feedback && <div className="mt-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900"><div className="font-bold">Mentor feedback</div><p className="mt-1 whitespace-pre-wrap">{assignment.feedback.remarks}</p>{assignment.feedback.grade && <p className="mt-2 text-xs font-semibold">Rubric grade: {assignment.feedback.grade}</p>}</div>}{submission?.fileUrl && <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><ExternalLink size={14}/> Open submitted work</a>}</div>}
        {!closed && canResubmit ? <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-base font-bold text-slate-900">{submission ? 'Resubmit work' : 'Submit your work'}</h2><p className="mt-1 text-xs text-slate-500">{submission ? 'Upload revised work while resubmissions remain available.' : 'The server validates type, deadline, late policy, and ownership.'}</p></div><CheckCircle2 className={submission ? 'text-indigo-600' : 'text-slate-300'} size={20}/></div>{error&&<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}{message&&<div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}{needsText&&<div><label className="mb-2 block text-sm font-semibold text-slate-700">Written response</label><textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={10} maxLength={5000} placeholder="Write your solution or response..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></div>}{needsFile&&<div className="mt-5"><label className="mb-2 block text-sm font-semibold text-slate-700">Upload PDF / ZIP</label><div className="rounded-xl border border-dashed border-slate-300 p-4"><input type="file" accept=".pdf,.zip,application/pdf,application/zip" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full text-sm"/><p className="mt-2 text-xs text-slate-400">Maximum 20 MB. PDF and ZIP files are accepted.</p>{file&&<p className="mt-2 text-xs font-semibold text-slate-600">Selected: {file.name}</p>}</div></div>}<div className="mt-5"><label className="mb-2 block text-sm font-semibold text-slate-700">GitHub / Google Docs link <span className="font-normal text-slate-400">(optional)</span></label><div className="relative"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input value={externalLink} onChange={(e)=>setExternalLink(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/></div></div><button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"><UploadCloud size={16}/>{submitting?'Submitting...':submission?'Submit revised work':'Submit assignment'}<Send size={14}/></button></form> : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{closed ? 'This assignment is closed and no longer accepts submissions.' : 'No further submissions are currently permitted.'}</div>}
      </section>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold text-slate-900">Assignment policy</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-500">Deadline</span><span className="text-right font-semibold text-slate-900">{formatDate(assignment.dueDate)}</span></div><div className="flex justify-between gap-4"><span className="text-slate-500">Grace period</span><span className="font-semibold text-slate-900">{assignment.latePolicy?.graceDays || 0} day(s)</span></div><div className="flex justify-between gap-4"><span className="text-slate-500">Late penalty</span><span className="font-semibold text-slate-900">{assignment.latePolicy?.penaltyPerDay || 0}% / day</span></div><div className="flex justify-between gap-4"><span className="text-slate-500">Resubmissions</span><span className="font-semibold text-slate-900">{assignment.allowResubmission ? assignment.maxResubmissions : 0}</span></div></div></aside>
    </div>
  </StudentPageShell>;
}
