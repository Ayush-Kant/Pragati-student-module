import React from 'react';
import { Calendar, User, Code, Layers, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/projectHelpers';

export const ProjectOverview = ({ project }) => {
  const { category, course, startDate, dueDate, techStack = [], mentor } = project;

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
        <Layers className="w-4 h-4 text-indigo-400" /> Project Metadata Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
          <p className="text-xs text-slate-400 font-medium mb-1">Course / Domain</p>
          <p className="text-sm font-semibold text-slate-200">{course || category}</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
          <p className="text-xs text-slate-400 font-medium mb-1">Start Date</p>
          <p className="text-sm font-semibold text-slate-200">{formatDate(startDate)}</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
          <p className="text-xs text-slate-400 font-medium mb-1">Target Submission</p>
          <p className="text-sm font-semibold text-indigo-400">{formatDate(dueDate)}</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
          <p className="text-xs text-slate-400 font-medium mb-1">Assigned Mentor</p>
          <p className="text-sm font-semibold text-slate-200">{mentor?.name || 'Unassigned'}</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-indigo-400" /> Technology Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
