import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Calendar, CheckCircle2, Clock, Upload, BarChart3, ListTodo } from 'lucide-react';
import { formatDate, getProjectStatusBadgeColor, formatStatusLabel } from '../../utils/projectHelpers';
import { MODULE_ROUTES } from '../../constants/projectConstants';

export const ProjectHeader = ({ project, activeTab, onSelectTab }) => {
  const navigate = useNavigate();
  const { id, title, subtitle, status, category, course, dueDate, githubRepoUrl } = project;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CheckCircle2 },
    { id: 'milestones', label: 'Milestones & Tasks', icon: ListTodo },
    { id: 'submission', label: 'Deliverables & Submissions', icon: Upload },
    { id: 'feedback', label: 'Mentor Review', icon: CheckCircle2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-slate-800/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(MODULE_ROUTES.PROJECTS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Projects
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {course || category}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getProjectStatusBadgeColor(status)}`}>
              {formatStatusLabel(status)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
          <p className="text-slate-300 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {githubRepoUrl && (
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl text-xs font-semibold transition-all shadow-md"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
          )}
          <button
            onClick={() => navigate(MODULE_ROUTES.PROJECT_SUBMISSION(id))}
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Upload className="w-4 h-4" /> Submit Deliverable
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 pt-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/40 hover:border-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectHeader;
