import React from "react";
import { Clock, FileCheck, ExternalLink, Paperclip } from "lucide-react";
import ProjectStatusBadge from "../project/ProjectStatusBadge";
import { formatDate } from "../../utils/projectHelpers";

export const SubmissionHistory = ({ submissions = [] }) => {
  if (!submissions || submissions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-surface-900 dark:text-white">Submission History</h3>
        <span className="text-xs text-surface-500">{submissions.length} Total Submissions</span>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-200/70 dark:border-surface-700/70"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="text-sm font-bold text-surface-900 dark:text-white">{sub.title}</h4>
                <div className="flex items-center space-x-2 text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submitted on {formatDate(sub.submittedAt, true)}</span>
                  <span>by {sub.submittedBy?.name || "Student"}</span>
                </div>
              </div>
              <ProjectStatusBadge status={sub.status} size="sm" />
            </div>

            <p className="text-xs text-surface-700 dark:text-surface-300 mb-3 bg-white dark:bg-surface-800 p-3 rounded-lg border border-surface-100 dark:border-surface-700">
              {sub.notes}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-surface-200/60 dark:border-surface-700">
              {sub.githubRepoUrl && (
                <a
                  href={sub.githubRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Commit {sub.commitHash || "link"}</span>
                </a>
              )}

              {sub.uploadedFiles && sub.uploadedFiles.length > 0 && (
                <span className="inline-flex items-center space-x-1 text-surface-500 font-medium">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{sub.uploadedFiles.length} files attached</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionHistory;
