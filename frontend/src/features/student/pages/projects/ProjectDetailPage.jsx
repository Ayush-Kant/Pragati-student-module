import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { getProjectOverallStatus, formatDate, getProjectProgress } from '../../utils/projectHelpers';
import { STATUS_STYLES } from '../../constants/projectConstants';
import MilestoneTimeline from '../../components/projects/MilestoneTimeline';
import MilestoneSubmitForm from '../../components/projects/MilestoneSubmitForm';
import FinalSubmitForm from '../../components/projects/FinalSubmitForm';
import ProjectRubricViewer from '../../components/projects/ProjectRubricViewer';
import { ArrowLeft, BookOpen, Calendar, ShieldCheck, FileCheck2, LayoutGrid, CheckCircle2 } from 'lucide-react';

/**
 * ProjectDetailPage page.
 * Sticky timeline sidebar on desktop, collapses to horizontal scroll stepper on mobile.
 * Features tabs for detailed project brief, milestone form, final form, and rubric.
 */
export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { project, loading, error, fetchProjectById } = useProjects();
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones'); // 'brief', 'milestones', 'final', 'rubric'

  // Load project details
  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then((data) => {
        // Auto-select the first pending milestone, otherwise select the first milestone
        if (data && data.milestones?.length > 0) {
          const firstPending = data.milestones.find(m => !m.submitted);
          setSelectedMilestone(firstPending || data.milestones[0]);
        }
      }).catch(() => {
        // Handled by hook error state
      });
    }
  }, [projectId, fetchProjectById]);

  const handleMilestoneSelect = (milestone) => {
    setSelectedMilestone(milestone);
    setActiveTab('milestones'); // Automatically switch tab to milestone form
  };

  const handleRefresh = () => {
    if (projectId) {
      fetchProjectById(projectId).then((data) => {
        if (data && selectedMilestone) {
          // Keep current milestone selection but update its contents
          const updated = data.milestones.find(m => m.id === selectedMilestone.id);
          if (updated) setSelectedMilestone(updated);
        }
      });
    }
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-pragati-bg text-pragati-text flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-pragati-border border-t-pragati-accent rounded-full animate-spin"></div>
        <p className="text-sm text-pragati-muted">Loading project workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-pragati-bg text-pragati-text flex flex-col items-center justify-center p-4">
        <div className="bg-pragati-surface border border-pragati-border rounded-xl p-8 text-center max-w-md w-full shadow-2xl">
          <ShieldCheck className="w-16 h-16 text-pragati-danger mx-auto mb-4" />
          <h3 className="text-xl font-bold">Workspace Unavailable</h3>
          <p className="text-sm text-pragati-muted mt-2">
            {error || 'The requested project could not be found or initialized.'}
          </p>
          <Link 
            to="/projects" 
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-pragati-surface hover:bg-pragati-bg border border-pragati-border text-sm font-semibold rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const overallStatus = getProjectOverallStatus(project);
  const statusStyle = STATUS_STYLES[overallStatus];
  const progress = getProjectProgress(project);

  return (
    <div className="min-h-screen bg-pragati-bg text-pragati-text pb-16">
      
      {/* Upper Navigation Bar */}
      <nav className="border-b border-pragati-border bg-pragati-surface/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
          <Link 
            to="/projects" 
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-pragati-muted hover:text-pragati-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="text-xs text-pragati-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pragati-success animate-pulse"></span>
            Pragati Student Portal
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-8 md:px-8">
        
        {/* Project Header Shell */}
        <section className="bg-pragati-surface border border-pragati-border rounded-xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                  {overallStatus}
                </span>
                <span className="text-xs text-pragati-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Final Due: {formatDate(project.finalDueAt)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-pragati-text">
                {project.title}
              </h2>
            </div>
            
            {/* Overall Progress Tracker */}
            <div className="w-full md:w-64 bg-pragati-bg border border-pragati-border p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between text-xs text-pragati-muted mb-2 font-medium">
                <span>Overall Completion</span>
                <span className="font-bold text-pragati-text">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-pragati-surface border border-pragati-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pragati-accent to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout Grid (Timeline Sidebar vs Action Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STICKY TIMELINE SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-140px)] overflow-y-auto">
            <MilestoneTimeline 
              milestones={project.milestones}
              selectedMilestoneId={selectedMilestone?.id}
              onSelectMilestone={handleMilestoneSelect}
            />
          </aside>

          {/* MAIN ACTIONS WORKSPACE */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Tabs for Action Workspace */}
            <div className="flex border-b border-pragati-border overflow-x-auto scrollbar-none bg-pragati-surface/30 p-1.5 rounded-xl gap-2">
              <button
                onClick={() => setActiveTab('brief')}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'brief' 
                    ? 'bg-pragati-surface text-pragati-accent border border-pragati-border' 
                    : 'text-pragati-muted hover:text-pragati-text'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Project Brief
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'milestones' 
                    ? 'bg-pragati-surface text-pragati-accent border border-pragati-border' 
                    : 'text-pragati-muted hover:text-pragati-text'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                Milestone Check-in
              </button>
              <button
                onClick={() => setActiveTab('final')}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'final' 
                    ? 'bg-pragati-surface text-pragati-accent border border-pragati-border' 
                    : 'text-pragati-muted hover:text-pragati-text'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Final Submission
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'rubric' 
                    ? 'bg-pragati-surface text-pragati-accent border border-pragati-border' 
                    : 'text-pragati-muted hover:text-pragati-text'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Rubric
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="transition-all duration-300">
              
              {/* Tab 1: Project Brief */}
              {activeTab === 'brief' && (
                <div className="space-y-6">
                  {/* Scope & Description Card */}
                  <div className="bg-pragati-surface border border-pragati-border rounded-xl p-6 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-pragati-text">Project Scope & Objectives</h3>
                    <p className="text-sm md:text-base text-pragati-muted leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                    <div className="p-4 bg-pragati-bg border border-pragati-border rounded-xl">
                      <span className="text-xs font-bold text-pragati-accent uppercase tracking-wider block mb-1">Scope Statement</span>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {project.scope}
                      </p>
                    </div>
                  </div>

                  {/* Deliverables Card */}
                  <div className="bg-pragati-surface border border-pragati-border rounded-xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-pragati-text mb-4">Required Deliverables</h3>
                    <ul className="space-y-3">
                      {project.deliverables?.map((d, idx) => (
                        <li key={idx} className="text-sm text-pragati-muted flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-pragati-border text-[10px] font-bold text-pragati-accent flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-slate-300">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Milestone Submission Form */}
              {activeTab === 'milestones' && (
                <MilestoneSubmitForm 
                  projectId={project.projectId}
                  milestone={selectedMilestone}
                  onSubmissionSuccess={handleRefresh}
                />
              )}

              {/* Tab 3: Final Project Submission Form */}
              {activeTab === 'final' && (
                <FinalSubmitForm 
                  project={project}
                  onSubmissionSuccess={handleRefresh}
                />
              )}

              {/* Tab 4: Rubric Panel */}
              {activeTab === 'rubric' && (
                <ProjectRubricViewer rubric={project.rubric} />
              )}

            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
