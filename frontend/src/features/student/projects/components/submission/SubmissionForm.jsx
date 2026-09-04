import { useState } from 'react';
import { GitBranch, Globe, FileText, MessageSquare, Send, AlertCircle, Upload } from 'lucide-react';
import { FileUploadZone, FileList } from './FileUploadZone';
import { SUBMISSION_STATE } from '../../constants/projectConstants';
import { getSubmissionStateLabel, getSubmissionStateColor } from '../../utils/submissionHelpers';

const SubmissionForm = ({ projectId: _projectId, submissionState, formErrors, existingSubmission, onSubmit, upload }) => {
  const isReadOnly = [SUBMISSION_STATE.SUBMITTED, SUBMISSION_STATE.UNDER_REVIEW, SUBMISSION_STATE.EVALUATED].includes(submissionState);
  const isSubmitting = submissionState === SUBMISSION_STATE.SUBMITTING;
  const [reportFile, setReportFile] = useState(null);
  const [form, setForm] = useState({
    githubUrl: existingSubmission?.githubUrl ?? '',
    deploymentUrl: existingSubmission?.deploymentUrl ?? '',
    description: existingSubmission?.description ?? '',
    documentation: existingSubmission?.documentation ?? '',
    additionalComments: existingSubmission?.additionalComments ?? '',
  });
  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...form, reportFile }); };
  const stateLabel = getSubmissionStateLabel(submissionState);
  const stateColor = getSubmissionStateColor(submissionState);
  const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-gray-800 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 hover:border-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="flex items-center gap-2 p-3 bg-white/2 border border-white/5 rounded-xl"><span className="text-xs text-gray-500">Status:</span><span className={`text-xs font-semibold ${stateColor}`}>{stateLabel}</span></div>
      {formErrors.length > 0 && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-1">{formErrors.map((err, i) => <p key={i} className="text-sm text-red-400 flex items-start gap-2"><AlertCircle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />{err}</p>)}</div>}

      <div><label htmlFor="sub-github-url" className="block text-xs font-medium text-gray-400 mb-1.5"><span className="flex items-center gap-1.5"><GitBranch size={12} />GitHub Repository URL <span className="text-red-400">*</span></span></label><input id="sub-github-url" type="url" value={form.githubUrl} onChange={handleChange('githubUrl')} placeholder="https://github.com/username/repo-name" disabled={isReadOnly || isSubmitting} required className={inputClass} /></div>
      <div><label htmlFor="sub-deployment-url" className="block text-xs font-medium text-gray-400 mb-1.5"><span className="flex items-center gap-1.5"><Globe size={12} />Deployment URL <span className="text-gray-600">(optional)</span></span></label><input id="sub-deployment-url" type="url" value={form.deploymentUrl} onChange={handleChange('deploymentUrl')} placeholder="https://your-app.vercel.app" disabled={isReadOnly || isSubmitting} className={inputClass} /></div>
      <div><label htmlFor="sub-description" className="block text-xs font-medium text-gray-400 mb-1.5"><span className="flex items-center gap-1.5"><FileText size={12} />Project Description <span className="text-red-400">*</span></span></label><textarea id="sub-description" value={form.description} onChange={handleChange('description')} placeholder="Describe what you built, your approach, and key features…" disabled={isReadOnly || isSubmitting} required rows={4} className={`${inputClass} resize-none`} /><p className="text-xs text-gray-600 mt-1 text-right">{form.description.length}/2000</p></div>
      <div><label htmlFor="sub-documentation" className="block text-xs font-medium text-gray-400 mb-1.5"><span className="flex items-center gap-1.5"><FileText size={12} />Documentation Notes <span className="text-gray-600">(optional)</span></span></label><textarea id="sub-documentation" value={form.documentation} onChange={handleChange('documentation')} placeholder="Setup instructions, known issues, or reviewer notes…" disabled={isReadOnly || isSubmitting} rows={3} className={`${inputClass} resize-none`} /></div>
      <div><label htmlFor="sub-comments" className="block text-xs font-medium text-gray-400 mb-1.5"><span className="flex items-center gap-1.5"><MessageSquare size={12} />Additional Comments <span className="text-gray-600">(optional)</span></span></label><textarea id="sub-comments" value={form.additionalComments} onChange={handleChange('additionalComments')} placeholder="Anything else you'd like to share with your mentor…" disabled={isReadOnly || isSubmitting} rows={2} className={`${inputClass} resize-none`} /></div>

      {!isReadOnly && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <label htmlFor="project-report" className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2"><Upload size={14} />Final project report <span className="text-gray-500 font-normal">(optional PDF, max 20MB)</span></label>
          <input id="project-report" type="file" accept="application/pdf,.pdf" disabled={isSubmitting} onChange={(e) => setReportFile(e.target.files?.[0] || null)} className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-violet-500 disabled:opacity-50" />
          {reportFile && <p className="mt-2 text-xs text-gray-500">Selected: {reportFile.name} · {(reportFile.size / 1024 / 1024).toFixed(2)} MB</p>}
        </div>
      )}

      {!isReadOnly && upload && (
        <div><p className="text-xs font-medium text-gray-400 mb-2">Additional File Attachments</p><FileUploadZone isDragging={upload.isDragging} validationErrors={upload.validationErrors} onDragOver={upload.onDragOver} onDragLeave={upload.onDragLeave} onDrop={upload.onDrop} onBrowse={upload.addFiles} />{upload.fileEntries.length > 0 && <div className="mt-3"><FileList fileEntries={upload.fileEntries} onRemove={upload.removeFile} onRetry={upload.retryUpload} onCancel={upload.cancelUpload} /></div>}</div>
      )}

      {isReadOnly && existingSubmission?.files?.length > 0 && <div><p className="text-xs font-medium text-gray-400 mb-2">Attached Files</p><ul className="space-y-2">{existingSubmission.files.map((f) => <li key={f.id} className="flex items-center gap-3 bg-white/2 border border-white/5 rounded-xl px-4 py-2.5"><span className="text-xs text-gray-300 flex-1 truncate">{f.name}</span><span className="text-xs text-gray-600">{(f.size / (1024 * 1024)).toFixed(1)} MB</span></li>)}</ul></div>}

      {!isReadOnly && <button type="submit" disabled={isSubmitting} aria-label={isSubmitting ? 'Submitting project, please wait' : 'Submit project'} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">{isSubmitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : <><Send size={16} />Submit Project</>}</button>}
    </form>
  );
};

export default SubmissionForm;
