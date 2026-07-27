import React, { useState, useEffect } from 'react';
import { useMilestoneSubmission } from '../../hooks/useMilestoneSubmission';
import { validateMilestoneSubmission } from '../../validations/projectValidation';
import { formatDate } from '../../utils/projectHelpers';
import { CheckCircle, AlertCircle, Link2, FileText, Globe, Loader2 } from 'lucide-react';

/**
 * MilestoneSubmitForm component.
 * Manages form state, character count, validation, and submission of milestone check-ins.
 */
export const MilestoneSubmitForm = ({ 
  projectId, 
  milestone, 
  onSubmissionSuccess 
}) => {
  const { submitMilestone, loading, error: apiError, success, resetStatus } = useMilestoneSubmission();

  // Form states
  const [githubUrl, setGithubUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form when milestone changes
  useEffect(() => {
    resetStatus();
    setErrors({});
    if (milestone?.submitted && milestone?.submissionDetails) {
      setGithubUrl(milestone.submissionDetails.githubUrl || '');
      setDeployedUrl(milestone.submissionDetails.deployedUrl || '');
      setNotes(milestone.submissionDetails.notes || '');
    } else {
      setGithubUrl('');
      setDeployedUrl('');
      setNotes('');
    }
  }, [milestone, resetStatus]);

  if (!milestone) {
    return (
      <div className="bg-pragati-surface border border-pragati-border rounded-xl p-8 text-center text-pragati-muted">
        Select a milestone from the timeline to submit or view progress.
      </div>
    );
  }

  const isOverdue = new Date(milestone.dueAt) < new Date();
  const isSubmitted = milestone.submitted;
  const isDisabled = isSubmitted || isOverdue;

  // Handle character count
  const charLimit = 1000;
  const handleNotesChange = (e) => {
    const text = e.target.value;
    if (text.length <= charLimit) {
      setNotes(text);
      if (errors.notes) {
        setErrors(prev => ({ ...prev, notes: null }));
      }
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    const payload = { githubUrl, deployedUrl, notes };
    const validation = validateMilestoneSubmission(payload);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    try {
      await submitMilestone(projectId, milestone.id, payload);
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } catch {
      // API error handled by the hook
    }
  };

  // Render Success Confirmation UI
  if (success) {
    return (
      <div className="bg-pragati-surface border border-pragati-success/20 rounded-xl p-8 text-center shadow-xl transition-all duration-300">
        <div className="mx-auto w-16 h-16 bg-pragati-success/10 border border-pragati-success/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-pragati-success" />
        </div>
        <h3 className="text-xl font-bold text-pragati-text">Check-in Submitted!</h3>
        <p className="text-sm text-pragati-muted mt-2 max-w-md mx-auto">
          Milestone {milestone.number} progress check-in was successfully recorded. Your mentor has been notified.
        </p>
        
        <div className="mt-6 p-4 bg-pragati-bg border border-pragati-border rounded-xl text-left space-y-2 max-w-md mx-auto text-xs">
          <div className="flex items-center gap-2 text-pragati-text">
            <Link2 className="w-4 h-4 text-pragati-accent" />
            <span className="font-semibold">GitHub:</span>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-pragati-accent hover:underline truncate">
              {githubUrl}
            </a>
          </div>
          {deployedUrl && (
            <div className="flex items-center gap-2 text-pragati-text">
              <Globe className="w-4 h-4 text-pragati-success" />
              <span className="font-semibold">Live Site:</span>
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-pragati-success hover:underline truncate">
                {deployedUrl}
              </a>
            </div>
          )}
          {notes && (
            <div className="pt-2 border-t border-pragati-border mt-2">
              <span className="font-semibold text-pragati-muted block mb-1">Progress Notes:</span>
              <p className="text-pragati-text whitespace-pre-wrap">{notes}</p>
            </div>
          )}
        </div>

        <button 
          onClick={resetStatus}
          className="mt-6 px-5 py-2 bg-pragati-surface hover:bg-pragati-bg text-pragati-text border border-pragati-border hover:border-pragati-muted text-sm font-semibold rounded-lg transition-all duration-200"
        >
          View Submission Form
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pragati-surface border border-pragati-border rounded-xl p-6 shadow-xl">
      <div className="border-b border-pragati-border pb-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-pragati-text">
            Milestone {milestone.number}: {milestone.title}
          </h3>
        </div>
        <p className="text-xs text-pragati-muted mt-1">
          Deadline: {formatDate(milestone.dueAt)}
        </p>
      </div>

      {/* Overdue Alert banner */}
      {isOverdue && !isSubmitted && (
        <div className="mb-6 p-4 bg-pragati-danger/10 border border-pragati-danger/20 rounded-xl text-xs md:text-sm text-pragati-danger flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Deadline Passed:</span> Submission portal closed on {formatDate(milestone.dueAt)}. You are no longer permitted to submit milestone updates for this item.
          </div>
        </div>
      )}

      {/* Submitted Banner */}
      {isSubmitted && (
        <div className="mb-6 p-4 bg-pragati-success/10 border border-pragati-success/20 rounded-xl text-xs md:text-sm text-pragati-success flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Submitted:</span> This milestone check-in was recorded on {milestone.submissionDetails ? formatDate(milestone.submissionDetails.submittedAt) : 'N/A'}. Details are locked for review.
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* GitHub URL (Required) */}
        <div>
          <label htmlFor="milestone-github" className="block text-sm font-semibold text-pragati-text mb-2 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-pragati-accent" />
            GitHub Repository URL <span className="text-pragati-danger">*</span>
          </label>
          <input
            id="milestone-github"
            type="text"
            placeholder="https://github.com/username/repo-name"
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              if (errors.githubUrl) setErrors(prev => ({ ...prev, githubUrl: null }));
            }}
            disabled={isDisabled}
            className={`w-full bg-pragati-bg border rounded-xl px-4 py-3 text-sm text-pragati-text placeholder-slate-600 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.githubUrl 
                ? 'border-pragati-danger focus:ring-pragati-danger focus:border-pragati-danger' 
                : 'border-pragati-border focus:ring-pragati-accent focus:border-pragati-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.githubUrl && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.githubUrl}
            </p>
          )}
          <span className="text-[10px] text-pragati-muted mt-1 block">
            Tip: Use <code className="text-pragati-accent bg-pragati-bg px-1 rounded">https://github.com/.../error-400</code>, <code className="text-pragati-accent bg-pragati-bg px-1 rounded">error-403</code>, or <code className="text-pragati-accent bg-pragati-bg px-1 rounded">error-409</code> to test simulated API error responses.
          </span>
        </div>

        {/* Deployed URL (Optional) */}
        <div>
          <label htmlFor="milestone-deploy" className="block text-sm font-semibold text-pragati-text mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-pragati-success" />
            Deployed Demo URL <span className="text-pragati-muted font-normal">(Optional)</span>
          </label>
          <input
            id="milestone-deploy"
            type="text"
            placeholder="https://my-app.vercel.app"
            value={deployedUrl}
            onChange={(e) => {
              setDeployedUrl(e.target.value);
              if (errors.deployedUrl) setErrors(prev => ({ ...prev, deployedUrl: null }));
            }}
            disabled={isDisabled}
            className={`w-full bg-pragati-bg border rounded-xl px-4 py-3 text-sm text-pragati-text placeholder-slate-600 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.deployedUrl 
                ? 'border-pragati-danger focus:ring-pragati-danger focus:border-pragati-danger' 
                : 'border-pragati-border focus:ring-pragati-accent focus:border-pragati-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.deployedUrl && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.deployedUrl}
            </p>
          )}
        </div>

        {/* Progress Notes (Optional) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="milestone-notes" className="text-sm font-semibold text-pragati-text flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Progress Notes <span className="text-pragati-muted font-normal">(Optional)</span>
            </label>
            <span className={`text-xs ${notes.length >= charLimit ? 'text-pragati-danger' : 'text-pragati-muted'}`}>
              {notes.length} / {charLimit}
            </span>
          </div>
          <textarea
            id="milestone-notes"
            rows="4"
            placeholder="Describe what has been completed, key challenges overcome, or items ready for review..."
            value={notes}
            onChange={handleNotesChange}
            disabled={isDisabled}
            className={`w-full bg-pragati-bg border rounded-xl px-4 py-3 text-sm text-pragati-text placeholder-slate-600 focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${
              errors.notes 
                ? 'border-pragati-danger focus:ring-pragati-danger focus:border-pragati-danger' 
                : 'border-pragati-border focus:ring-pragati-accent focus:border-pragati-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {errors.notes && (
            <p className="text-xs text-pragati-danger mt-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.notes}
            </p>
          )}
        </div>

        {/* Global/API errors */}
        {apiError && (
          <div className="p-3 bg-pragati-danger/10 border border-pragati-danger/20 rounded-lg text-xs text-pragati-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Action Button */}
        {!isDisabled && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pragati-accent to-amber-500 hover:from-amber-500 hover:to-pragati-accent text-pragati-bg font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Check-in...
              </>
            ) : (
              'Submit Milestone Check-in'
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default MilestoneSubmitForm;
