import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, GitBranch, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import {
  formatDeadline,
  formatRelativeTime,
  isOverdue,
  isApproachingDeadline,
} from '../../utils/projectHelpers';

/**
 * Card representing a single project on the dashboard.
 * @param {{ project: object }} props
 */
const ProjectCard = memo(({ project }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/student/projects/${project.id}`);
  }, [navigate, project.id]);

  const overdue = isOverdue(project.deadline);
  const approaching = isApproachingDeadline(project.deadline, 3);

  const deadlineColor = overdue
    ? 'text-red-400'
    : approaching
    ? 'text-yellow-400'
    : 'text-gray-400';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="bg-gradient-to-br from-white/3 to-transparent border border-white/8 rounded-2xl p-5 cursor-pointer group
        hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10
        hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-violet-500/50 backdrop-blur-sm"
      aria-label={`${project.title} — ${project.status}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-violet-300 transition-colors mb-1">
            {project.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">{project.mentorName} · {project.batchName}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={project.status} variant="project" />
          <ChevronRight size={14} className="text-gray-600 group-hover:text-violet-400 transition-colors" aria-hidden="true" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Tech stack */}
      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 border border-gray-700/50"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-500">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-300">{project.overallProgress}%</span>
        </div>
        <ProgressBar value={project.overallProgress} showLabel={false} size="sm" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className={`flex items-center gap-1 ${deadlineColor}`}>
          {overdue ? (
            <Clock size={12} aria-hidden="true" />
          ) : (
            <Calendar size={12} aria-hidden="true" />
          )}
          <span>
            {overdue
              ? `Overdue · ${formatDeadline(project.deadline)}`
              : `Due ${formatRelativeTime(project.deadline)}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <GitBranch size={12} aria-hidden="true" />
          <span>{project.durationWeeks}w project</span>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
