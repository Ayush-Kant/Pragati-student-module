import { memo, useCallback } from 'react';
import { Calendar, Clock, GitBranch, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import ProgressBar from '../common/ProgressBar';
import { formatDeadline, formatRelativeTime, isOverdue, isApproachingDeadline } from '../../utils/projectHelpers';

const ProjectCard = memo(({ project }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate(`/student/projects/${project.id}`), [navigate, project.id]);
  const overdue = isOverdue(project.deadline);
  const approaching = isApproachingDeadline(project.deadline, 3);
  const deadlineColor = overdue ? 'text-rose-600' : approaching ? 'text-amber-600' : 'text-slate-500';

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
      aria-label={`${project.title} — ${project.status}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-sm font-bold text-slate-900 group-hover:text-violet-700">{project.title}</h3>
          <p className="truncate text-xs text-slate-500">{project.mentorName || 'Mentor assigned'}{project.batchName ? ` · ${project.batchName}` : ''}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={project.status} variant="project" />
          <ChevronRight size={15} className="text-slate-300 transition group-hover:text-violet-500" />
        </div>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">{project.description || 'Open the project to view the full brief and requirements.'}</p>

      {project.techStack?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => <span key={tech} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{tech}</span>)}
          {project.techStack.length > 4 && <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">+{project.techStack.length - 4}</span>}
        </div>
      )}

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Overall progress</span>
          <span className="text-xs font-bold text-slate-700">{Number(project.overallProgress || 0)}%</span>
        </div>
        <ProgressBar value={Number(project.overallProgress || 0)} showLabel={false} size="sm" />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
        <div className={`flex items-center gap-1.5 ${deadlineColor}`}>
          {overdue ? <Clock size={13} /> : <Calendar size={13} />}
          <span>{overdue ? `Overdue · ${formatDeadline(project.deadline)}` : `Due ${formatRelativeTime(project.deadline)}`}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500"><GitBranch size={13} /><span>{project.durationWeeks ? `${project.durationWeeks}w` : 'Project'}</span></div>
      </div>
    </button>
  );
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
