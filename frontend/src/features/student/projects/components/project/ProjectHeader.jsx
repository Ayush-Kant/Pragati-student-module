import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, FileCheck, BarChart3, UploadCloud } from "lucide-react";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { formatDate } from "../../utils/projectHelpers";

export const ProjectHeader = ({ project }) => {
  if (!project) return null;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-surface-700 p-6 md:p-8 shadow-sm mb-8">
      {/* Back button */}
      <Link
        to="/student/projects"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-surface-500 hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects List</span>
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full">
              {project.category}
            </span>
            <ProjectStatusBadge status={project.status} size="md" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-2">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-surface-500 dark:text-surface-400">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Started: {formatDate(project.startDate)}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Due: {formatDate(project.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/student/projects/${project.id}/analytics`}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-800 dark:text-surface-200 font-semibold text-xs rounded-xl transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
          <Link
            to={`/student/projects/${project.id}/submit`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Submit Work</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
