import { FolderOpen } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/dashboard/ProjectCard';
import ProjectStatsBar from '../components/dashboard/ProjectStatsBar';
import ProjectFilters from '../components/dashboard/ProjectFilters';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const ProjectsDashboardPage = () => {
  const { projects, filteredProjects, stats, isLoading, error, searchQuery, statusFilter, setSearchQuery, setStatusFilter, refetch } = useProjects();

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-start gap-3">
          <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><FolderOpen size={23} /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Projects</h1>
            <p className="mt-1 text-sm text-slate-500">Track your project brief, milestones, submissions, and evaluation status.</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="card" count={6} />
        ) : (
          <>
            <ProjectStatsBar stats={stats} />
            <ProjectFilters searchQuery={searchQuery} statusFilter={statusFilter} onSearchChange={setSearchQuery} onStatusChange={setStatusFilter} />

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                {filteredProjects.length !== projects.length ? ` (filtered from ${projects.length} total)` : ''}
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <EmptyState
                title="No projects found"
                description={projects.length === 0 ? 'You have not been assigned any projects yet.' : 'Try adjusting your filters or search query.'}
                icon={projects.length === 0 ? '📁' : '🔍'}
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboardPage;
