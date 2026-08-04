import React from 'react';
import { History, FileText, Github, Clock } from 'lucide-react';
import { formatDateTime, getSubmissionStatusBadgeColor, formatStatusLabel, formatFileSize } from '../../utils/projectHelpers';

export const SubmissionHistory = ({ history = [] }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-indigo-400" /> Submission Audit Log ({history.length})
      </h3>

      {history.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No previous deliverables submitted for this project yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((sub) => (
            <div
              key={sub.id}
              className="bg-slate-900/70 border border-slate-700/40 rounded-xl p-4 transition-all hover:border-slate-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                    {sub.version}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{sub.title}</h4>
                </div>
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getSubmissionStatusBadgeColor(sub.status)}`}>
                  {formatStatusLabel(sub.status)}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3">{sub.notes}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Submitted on {formatDateTime(sub.submittedAt)}
                </span>

                {sub.githubRepoUrl && (
                  <a
                    href={sub.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Github className="w-3.5 h-3.5" /> Repository Commit ({sub.commitHash || 'main'})
                  </a>
                )}
              </div>

              {sub.files && sub.files.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                  {sub.files.map((file, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-indigo-400" /> {file.name} ({formatFileSize(file.size)})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
