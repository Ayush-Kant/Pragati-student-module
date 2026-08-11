import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, ArrowRight, GitBranch } from "lucide-react";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { formatDate } from "../../utils/projectHelpers";

export const ProjectCard = ({ project }) => {
  return (
    <div className="group bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top indicator strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg">
            {project.category}
          </span>
          <ProjectStatusBadge status={project.status} size="sm" />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1 mb-2">
          {project.title}
        </h3>
        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-xs font-medium mb-1.5">
            <span className="text-surface-600 dark:text-surface-400">Progress</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">{project.progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[11px] bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
          {project.tags?.length > 3 && (
            <span className="px-1.5 py-0.5 text-[11px] text-surface-400 font-medium">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-surface-100 dark:border-surface-700/80 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-surface-500 dark:text-surface-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-surface-400" />
            <span>Due {formatDate(project.dueDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-surface-400" />
            <span>{project.members?.length || 0}</span>
          </div>
        </div>

        <Link
          to={`/student/projects/${project.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
        >
          <span>View Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
