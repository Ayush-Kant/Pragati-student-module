import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { getProjectOverallStatus, getProjectProgress } from '../../utils/projectHelpers';
import { STATUS_STYLES } from '../../constants/projectConstants';
import { FolderGit2, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ProjectsPage page.
 * Displays a grid of project cards with status badges and progress indicators.
 */
export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Card Skeleton Loader for Loading State
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-pragati-surface border border-pragati-border rounded-xl p-6 space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-800 rounded w-1/3"></div>
            <div className="h-5 bg-slate-800 rounded-full w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-800 rounded w-1/4"></div>
              <div className="h-3 bg-slate-800 rounded w-10"></div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-pragati-bg text-pragati-text px-4 py-8 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pragati-text to-slate-400 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-sm md:text-base text-pragati-muted mt-2">
            Track milestones, upload deliverables, and check grading criteria.
          </p>
        </div>
        <div>
          <button 
            onClick={fetchProjects}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pragati-surface border border-pragati-border hover:border-pragati-muted text-sm font-semibold transition-all duration-200 text-pragati-text"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="bg-pragati-danger/10 border border-pragati-danger/20 rounded-xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-pragati-danger mx-auto mb-4" />
          <h3 className="text-lg font-bold text-pragati-text">Retrieval Error</h3>
          <p className="text-sm text-pragati-muted mt-2">{error}</p>
          <button 
            onClick={fetchProjects} 
            className="mt-4 px-4 py-2 bg-pragati-danger text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && projects.length === 0 && renderSkeletons()}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="bg-pragati-surface border border-pragati-border rounded-xl p-12 text-center max-w-md mx-auto">
          <FolderGit2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-pragati-text">No Assigned Projects</h3>
          <p className="text-sm text-pragati-muted mt-2">
            You do not currently have any assigned projects in this workspace. Contact your coordinator if this is an error.
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {!error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const overallStatus = getProjectOverallStatus(p);
            const statusStyle = STATUS_STYLES[overallStatus];
            const progress = getProjectProgress(p);
            const totalMilestones = p.milestones.length;
            const completedMilestones = p.milestones.filter(m => m.submitted).length;

            return (
              <div
                key={p.projectId}
                onClick={() => navigate(`/projects/${p.projectId}`)}
                className="group bg-pragati-surface border border-pragati-border hover:border-pragati-accent rounded-xl p-6 shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-pragati-accent/5 hover:-translate-y-1"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 bg-pragati-bg border border-pragati-border rounded-lg text-pragati-accent">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {overallStatus}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-pragati-text group-hover:text-pragati-accent transition-colors duration-200 truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs md:text-sm text-pragati-muted mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Footer Progress & Nav */}
                <div className="mt-6 pt-5 border-t border-pragati-border/60">
                  <div className="flex justify-between text-xs text-pragati-muted mb-2 font-medium">
                    <span>Progress ({completedMilestones}/{totalMilestones} Milestones)</span>
                    <span className="font-bold text-pragati-text">{progress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-pragati-bg border border-pragati-border rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-pragati-accent to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-end text-xs font-bold text-pragati-accent group-hover:gap-1.5 transition-all duration-200">
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
