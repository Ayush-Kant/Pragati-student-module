import React from "react";
import { GitBranch, GitCommit, ExternalLink } from "lucide-react";

export const GitHubRepository = ({ repo }) => {
  if (!repo) return null;

  return (
    <div className="bg-surface-900 text-white rounded-2xl p-5 shadow-lg mb-6 border border-surface-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-surface-800 rounded-lg text-brand-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Connected Repository</h4>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-white hover:text-brand-300 transition-colors flex items-center space-x-1"
            >
              <span>{repo.url.replace("https://github.com/", "")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-surface-800 text-surface-300 rounded-lg border border-surface-700">
          Branch: {repo.branch || "main"}
        </span>
      </div>

      {repo.lastCommit && (
        <div className="flex items-center space-x-2 text-xs text-surface-400 pt-3 border-t border-surface-800">
          <GitCommit className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="truncate">{repo.lastCommit}</span>
        </div>
      )}
    </div>
  );
};

export default GitHubRepository;
