/** ProjectWorkspacePage — milestone tracking and progress workspace. */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Layers, Calendar } from 'lucide-react';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { useMilestones } from '../hooks/useMilestones';
import MilestoneTimeline from '../components/milestones/MilestoneTimeline';
import MilestoneStatusBadge from '../components/milestones/MilestoneStatusBadge';
import MilestoneSubmitForm from '../components/milestones/MilestoneSubmitForm';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import { formatDeadline, isOverdue, isApproachingDeadline } from '../utils/projectHelpers';
import { formatMilestoneDue } from '../utils/milestoneHelpers';

const ProjectWorkspacePage = () => {
  const { projectId } = useParams();
  const [milestoneRefresh, setMilestoneRefresh] = useState(0);
  const { project, isLoading: projLoading, error: projError, refetch } = useProjectDetails(projectId);
  const { milestones, activeMilestone, progress, isLoading: mlLoading } = useMilestones(projectId, milestoneRefresh);

  if (projLoading || mlLoading) return <LoadingSpinner size="lg" label="Loading workspace…" />;
  if (projError) return <ErrorState error={projError} onRetry={refetch} />;
  if (!project) return <ErrorState error="Project not found." />;

  const overdue = isOverdue(project.deadline);
  const approaching = isApproachingDeadline(project.deadline);
  const deadlineColor = overdue ? 'text-red-400' : approaching ? 'text-yellow-400' : 'text-gray-300';

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 px-4 py-8 max-w-5xl mx-auto">
      <Link to={`/student/projects/${projectId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-300 transition-colors mb-6"><ArrowLeft size={14} />Back to Project Details</Link>
      <div className="mb-8"><div className="flex items-center gap-3 mb-1"><Target size={24} className="text-violet-400" /><h1 className="text-2xl font-extrabold">Workspace</h1></div><p className="text-sm text-gray-500 ml-9">{project.title}</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-5"><div className="flex items-center gap-2 mb-3"><Layers size={16} className="text-violet-400" /><span className="text-xs text-gray-400">Overall Progress</span></div><p className="text-3xl font-extrabold text-violet-300 mb-2">{project.overallProgress}%</p><ProgressBar value={project.overallProgress} showLabel={false} size="sm" /></div>
        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-5"><div className="flex items-center gap-2 mb-3"><Target size={16} className="text-blue-400" /><span className="text-xs text-gray-400">Milestones</span></div><p className="text-3xl font-extrabold text-blue-300 mb-1">{progress.completed}<span className="text-lg text-gray-500 font-normal">/{progress.total}</span></p><p className="text-xs text-gray-500">Completed</p></div>
        <div className={`bg-gradient-to-br ${overdue ? 'from-red-500/10' : 'from-gray-800/50'} to-transparent border ${overdue ? 'border-red-500/20' : 'border-white/6'} rounded-2xl p-5`}><div className="flex items-center gap-2 mb-3"><Calendar size={16} className={deadlineColor} /><span className="text-xs text-gray-400">Deadline</span></div><p className={`text-lg font-bold ${deadlineColor} mb-1`}>{formatDeadline(project.deadline)}</p>{overdue && <p className="text-xs text-red-400 font-medium">Overdue</p>}</div>
      </div>

      {activeMilestone && <div className="mb-8 bg-gradient-to-r from-violet-500/10 to-blue-500/5 border border-violet-500/25 rounded-2xl p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Current Milestone</p><h3 className="text-base font-bold mb-1">{activeMilestone.title}</h3><p className="text-sm text-gray-400 line-clamp-2">{activeMilestone.description}</p></div><div className="flex flex-col items-end gap-2"><MilestoneStatusBadge status={activeMilestone.status} /><p className="text-xs text-gray-600">Due {formatMilestoneDue(activeMilestone.dueDate)}</p></div></div>{activeMilestone.progress > 0 && <div className="mt-4"><ProgressBar value={activeMilestone.progress} showLabel size="sm" /></div>}<MilestoneSubmitForm projectId={projectId} milestone={activeMilestone} onSubmitted={() => setMilestoneRefresh((value) => value + 1)} /></div>}

      <div><h2 className="text-sm font-semibold text-gray-300 mb-5">All Milestones</h2><MilestoneTimeline milestones={milestones} /></div>
    </div>
  );
};

export default ProjectWorkspacePage;
