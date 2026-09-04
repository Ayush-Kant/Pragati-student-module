import { useState } from 'react';
import { GitBranch, Globe, Send } from 'lucide-react';
import { submitMilestone } from '../../services/projectService';

export default function MilestoneSubmitForm({ projectId, milestone, onSubmitted }) {
  const [githubUrl, setGithubUrl] = useState(milestone?.githubUrl || '');
  const [deployedUrl, setDeployedUrl] = useState(milestone?.deployedUrl || '');
  const [progressNotes, setProgressNotes] = useState(milestone?.progressNotes || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!milestone) return null;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^https:\/\/github\.com\//i.test(githubUrl.trim())) return setError('GitHub URL must start with https://github.com/.');
    if (deployedUrl.trim() && !/^https:\/\/[^\s]+$/i.test(deployedUrl.trim())) return setError('Deployment URL must be a valid HTTPS URL.');
    if (!progressNotes.trim()) return setError('Progress notes are required.');
    if (progressNotes.trim().length > 1000) return setError('Progress notes must be 1000 characters or fewer.');
    setSaving(true);
    try {
      const result = await submitMilestone(projectId, milestone.id, { githubUrl: githubUrl.trim(), deployedUrl: deployedUrl.trim() || null, progressNotes: progressNotes.trim() });
      if (!result.success) throw new Error(result.error);
      onSubmitted?.(result.data);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to submit milestone.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
      <div><p className="text-xs font-bold uppercase tracking-wide text-blue-300">Milestone Check-in</p><p className="text-xs text-gray-500 mt-1">Submit your GitHub progress and notes for mentor review.</p></div>
      {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
      <label className="block"><span className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5"><GitBranch size={12} />GitHub URL</span><input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} disabled={saving} placeholder="https://github.com/username/repository" className="w-full rounded-lg border border-gray-800 bg-black/30 px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500" /></label>
      <label className="block"><span className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5"><Globe size={12} />Deployed URL <span className="text-gray-600">(optional)</span></span><input value={deployedUrl} onChange={(e) => setDeployedUrl(e.target.value)} disabled={saving} placeholder="https://your-app.example" className="w-full rounded-lg border border-gray-800 bg-black/30 px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500" /></label>
      <label className="block"><span className="text-xs text-gray-400 mb-1.5 block">Progress notes</span><textarea value={progressNotes} onChange={(e) => setProgressNotes(e.target.value)} disabled={saving} maxLength={1000} rows={4} placeholder="What did you complete? What remains? Any blockers?" className="w-full rounded-lg border border-gray-800 bg-black/30 px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500 resize-none" /><span className="block mt-1 text-right text-[11px] text-gray-600">{progressNotes.length}/1000</span></label>
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"><Send size={13} />{saving ? 'Submitting…' : milestone.submissionId ? 'Update Check-in' : 'Submit Check-in'}</button>
      {milestone.submissionStatus && <p className="text-xs text-emerald-400">Last check-in submitted {milestone.submittedAt ? new Date(milestone.submittedAt).toLocaleString() : ''}.</p>}
    </form>
  );
}
