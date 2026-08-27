/**
 * ProjectsDashboardPage — lists all student projects with filters and stats.
 * Route: /student/projects
 */

import { FolderOpen } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/dashboard/ProjectCard';
import ProjectStatsBar from '../components/dashboard/ProjectStatsBar';
import ProjectFilters from '../components/dashboard/ProjectFilters';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const ProjectsDashboardPage = () => {
  const {
    projects,
    filteredProjects,
    stats,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    refetch,
  } = useProjects();

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 px-4 py-8 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen size={28} className="text-violet-400 drop-shadow-lg" aria-hidden="true" />
          <h1 className="text-4xl font-extrabold text-violet-300 drop-shadow-[0_0_12px_rgba(167,139,250,0.4)]">
            My Projects
          </h1>
        </div>
        <p className="text-gray-400">
          Track your project progress, milestones, and evaluations.
        </p>
      </div>

      {/* Stats bar — only shown when data is loaded */}
      {!isLoading && projects.length > 0 && <ProjectStatsBar stats={stats} />}

      {/* Filters — still render during loading for progressive layout stability */}
      {!isLoading && (
        <ProjectFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />
      )}

      {/* Loading state — card skeletons preserve grid layout */}
      {isLoading && (
        <SkeletonLoader variant="card" count={6} />
      )}

      {/* Results count */}
      {!isLoading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'project' : 'projects'}
            {filteredProjects.length !== projects.length
              ? ` (filtered from ${projects.length} total)`
              : ''}
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && (
        filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={
              projects.length === 0
                ? 'You have not been assigned any projects yet.'
                : 'Try adjusting your filters or search query.'
            }
            icon={projects.length === 0 ? '📁' : '🔍'}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ProjectsDashboardPage;
