import React from 'react';
import { Github, ExternalLink, GitBranch, GitCommit } from 'lucide-react';

export const GitHubRepositoryCard = ({ repoUrl, commitHash }) => {
  if (!repoUrl) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
          <Github className="w-5 h-5" />
        </div>
        <div className="truncate">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Target Repository
          </span>
          <p className="text-xs font-bold text-slate-100 truncate">{repoUrl}</p>
          {commitHash && (
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
              <GitCommit className="w-3 h-3 text-emerald-400" /> Commit: {commitHash}
            </span>
          )}
        </div>
      </div>

      <a
        href={repoUrl}
        target="_blank"
        rel="noreferrer"
        className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1"
      >
        <ExternalLink className="w-4 h-4" /> Open
      </a>
    </div>
  );
};

export default GitHubRepositoryCard;
