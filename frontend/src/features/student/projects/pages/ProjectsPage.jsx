import React, { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/project/ProjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import SectionHeader from '../components/common/SectionHeader';
import { Search, Filter, FolderKanban, Sparkles } from 'lucide-react';
import { PROJECT_STATUS } from '../constants/projectConstants';

export const ProjectsPage = () => {
  const { projects, isLoading, error, refetch } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(PROJECT_STATUS.ALL);

  // Filter projects by search query and status filter
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === PROJECT_STATUS.ALL || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, selectedStatus]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Retrieving student project records..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Unable to load projects"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Banner / Welcome Shell Header */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Module 9 — Student Project Workspace
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Academic Projects
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Manage capstone projects, track milestones, submit code deliverables, and review mentor feedback in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1 shrink-0" />
          {[
            { id: PROJECT_STATUS.ALL, label: 'All' },
            { id: PROJECT_STATUS.IN_PROGRESS, label: 'In Progress' },
            { id: PROJECT_STATUS.UNDER_REVIEW, label: 'Under Review' },
            { id: PROJECT_STATUS.NEEDS_REVISION, label: 'Needs Revision' },
            { id: PROJECT_STATUS.COMPLETED, label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match your filter"
          description="Try adjusting your search keywords or switching status filters to see available projects."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatus(PROJECT_STATUS.ALL);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
