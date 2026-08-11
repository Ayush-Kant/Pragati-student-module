import React, { useState } from "react";
import { Send, Github, CheckCircle, Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import UploadedFiles from "./UploadedFiles";
import GitHubRepository from "./GitHubRepository";

export const SubmissionForm = ({
  project,
  onSubmit,
  submitting,
  uploading,
  validationErrors = {},
  submittedSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    githubRepoUrl: project?.githubRepo?.url || "",
    githubBranch: project?.githubRepo?.branch || "main",
    commitHash: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, selectedFiles);
  };

  if (submittedSuccess) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-8 text-center shadow-lg my-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-extrabold text-surface-900 dark:text-white mb-2">
          Submission Received Successfully!
        </h3>
        <p className="text-sm text-surface-600 dark:text-surface-300 max-w-md mx-auto mb-6">
          Your project work and uploaded files have been submitted. Your assigned mentor has been notified for evaluation.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
        >
          Submit Another Artifact
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-extrabold text-surface-900 dark:text-white mb-6">
        Submit Project Milestone / Deliverables
      </h3>

      {/* Submission Title */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2">
          Submission Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Mid-Term Sprint Milestone Submission"
          className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900/60 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
            validationErrors.title
              ? "border-rose-400 focus:ring-rose-400"
              : "border-surface-300 dark:border-surface-600 focus:ring-brand-500"
          } dark:text-white`}
        />
        {validationErrors.title && (
          <p className="text-xs text-rose-500 mt-1">{validationErrors.title}</p>
        )}
      </div>

      {/* GitHub Repository Link */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Github className="w-4 h-4 text-surface-500" />
          <span>GitHub Repository URL *</span>
        </label>
        <input
          type="url"
          name="githubRepoUrl"
          value={formData.githubRepoUrl}
          onChange={handleChange}
          placeholder="https://github.com/organization/repository"
          className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900/60 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
            validationErrors.githubRepoUrl
              ? "border-rose-400 focus:ring-rose-400"
              : "border-surface-300 dark:border-surface-600 focus:ring-brand-500"
          } dark:text-white`}
        />
        {validationErrors.githubRepoUrl && (
          <p className="text-xs text-rose-500 mt-1">{validationErrors.githubRepoUrl}</p>
        )}
      </div>

      {/* Branch & Commit Optional Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
            Target Branch
          </label>
          <input
            type="text"
            name="githubBranch"
            value={formData.githubBranch}
            onChange={handleChange}
            placeholder="main"
            className="w-full px-3.5 py-2.5 bg-surface-50 dark:bg-surface-900/60 border border-surface-300 dark:border-surface-600 rounded-xl text-sm dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">
            Commit SHA (Optional)
          </label>
          <input
            type="text"
            name="commitHash"
            value={formData.commitHash}
            onChange={handleChange}
            placeholder="e.g. fa8291c"
            className="w-full px-3.5 py-2.5 bg-surface-50 dark:bg-surface-900/60 border border-surface-300 dark:border-surface-600 rounded-xl text-sm dark:text-white"
          />
        </div>
      </div>

      {/* Notes / Description */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2">
          Submission Notes & Summary *
        </label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Describe what was accomplished in this milestone, testing instructions, and key highlights..."
          className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900/60 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
            validationErrors.notes
              ? "border-rose-400 focus:ring-rose-400"
              : "border-surface-300 dark:border-surface-600 focus:ring-brand-500"
          } dark:text-white`}
        />
        {validationErrors.notes && (
          <p className="text-xs text-rose-500 mt-1">{validationErrors.notes}</p>
        )}
      </div>

      {/* File Upload Section */}
      <FileUpload
        selectedFiles={selectedFiles}
        onFilesChange={setSelectedFiles}
        error={validationErrors.files}
      />

      <UploadedFiles files={selectedFiles} onRemoveFile={handleRemoveFile} />

      {/* Submit Button */}
      <div className="pt-4 border-t border-surface-100 dark:border-surface-700 flex justify-end">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-brand-500/25 active:scale-95"
        >
          {submitting || uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploading ? "Uploading files..." : "Submitting..."}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Confirm & Submit Work</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;
