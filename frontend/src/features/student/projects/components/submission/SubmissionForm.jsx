import React, { useState } from 'react';
import { Send, Github, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import ProjectFiles from './ProjectFiles';
import { validateSubmissionForm } from '../../validations/projectValidation';

export const SubmissionForm = ({ onSubmit, defaultGithubRepoUrl = '', isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    githubRepoUrl: defaultGithubRepoUrl || '',
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateSubmissionForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
        setIsSuccess(true);
        setFormData({
          title: '',
          notes: '',
          githubRepoUrl: defaultGithubRepoUrl || '',
          files: [],
        });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div>
          <h3 className="text-base font-bold text-slate-100">Submit Project Deliverable</h3>
          <p className="text-xs text-slate-400">Upload code repository link, artifacts, and summary for faculty evaluation.</p>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Deliverable submitted successfully! Your mentor has been notified.
        </div>
      )}

      {errors.form && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" /> {errors.form}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="text-xs font-bold text-slate-200 block mb-1">
          Deliverable Title / Release Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Milestone 2 Deliverable — React Frontend Implementation"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full bg-slate-900 border text-slate-100 placeholder-slate-400 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors ${
            errors.title ? 'border-rose-500' : 'border-slate-700'
          }`}
        />
        {errors.title && <p className="text-rose-400 text-[11px] mt-1 font-medium">{errors.title}</p>}
      </div>

      {/* GitHub Repository Link */}
      <div>
        <label className="text-xs font-bold text-slate-200 block mb-1">
          GitHub Repository URL <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            placeholder="https://github.com/uptoskills-students/your-repo-name"
            value={formData.githubRepoUrl}
            onChange={(e) => handleChange('githubRepoUrl', e.target.value)}
            className={`w-full bg-slate-900 border text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors ${
              errors.githubRepoUrl ? 'border-rose-500' : 'border-slate-700'
            }`}
          />
        </div>
        {errors.githubRepoUrl && <p className="text-rose-400 text-[11px] mt-1 font-medium">{errors.githubRepoUrl}</p>}
      </div>

      {/* Notes / Description */}
      <div>
        <label className="text-xs font-bold text-slate-200 block mb-1">
          Submission Summary / Technical Notes <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe completed features, architecture highlights, setup steps, or any known limitations for the evaluator..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className={`w-full bg-slate-900 border text-slate-100 placeholder-slate-400 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-colors ${
            errors.notes ? 'border-rose-500' : 'border-slate-700'
          }`}
        />
        {errors.notes && <p className="text-rose-400 text-[11px] mt-1 font-medium">{errors.notes}</p>}
      </div>

      {/* File Upload Dropzone */}
      <ProjectFiles
        files={formData.files}
        onFilesChange={(files) => handleChange('files', files)}
      />
      {errors.files && <p className="text-rose-400 text-[11px] font-medium">{errors.files}</p>}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all inline-flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting Deliverable...' : 'Submit Deliverable for Review'}
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;
