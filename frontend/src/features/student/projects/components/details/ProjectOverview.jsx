import { Calendar, User, Clock, Layers } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import ProjectObjectives from './ProjectObjectives';
import TechnologyStack from './TechnologyStack';
import { formatDeadline, formatDate, isOverdue, isApproachingDeadline } from '../../utils/projectHelpers';

/**
 * Project overview section — hero info card.
 * Composed of smaller focused sub-components for objectives and tech stack.
 * @param {{ project: object }} props
 */
const ProjectOverview = ({ project }) => {
  const overdue = isOverdue(project.deadline);
  const approaching = isApproachingDeadline(project.deadline);
  const deadlineColor = overdue ? 'text-red-400' : approaching ? 'text-yellow-400' : 'text-gray-300';

  return (
    <div className="space-y-6">
      {/* Title + status */}
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">{project.title}</h2>
          <p className="text-sm text-gray-500">{project.batchName}</p>
        </div>
        <StatusBadge status={project.status} variant="project" />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className={deadlineColor} aria-hidden="true" />
            <span className="text-xs text-gray-500">Deadline</span>
          </div>
          <p className={`text-sm font-medium ${deadlineColor}`}>
            {formatDeadline(project.deadline)}
          </p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-violet-400" aria-hidden="true" />
            <span className="text-xs text-gray-500">Mentor</span>
          </div>
          <p className="text-sm font-medium text-gray-200">{project.mentorName}</p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-blue-400" aria-hidden="true" />
            <span className="text-xs text-gray-500">Duration</span>
          </div>
          <p className="text-sm font-medium text-gray-200">{project.durationWeeks} weeks</p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-teal-400" aria-hidden="true" />
            <span className="text-xs text-gray-500">Assigned</span>
          </div>
          <p className="text-sm font-medium text-gray-200">{formatDate(project.assignedAt)}</p>
        </div>
      </div>

      {/* Overall progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-sm font-bold text-gray-200">{project.overallProgress}%</span>
        </div>
        <ProgressBar value={project.overallProgress} showLabel={false} size="lg" />
      </div>

      {/* Extracted sub-components */}
      <ProjectObjectives objectives={project.objectives} />
      <TechnologyStack techStack={project.techStack} />
    </div>
  );
};

export default ProjectOverview;
