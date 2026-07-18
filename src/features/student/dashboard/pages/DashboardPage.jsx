/**
 * PLACEHOLDER — TEAM LEAD CONTRACT CONTRACT (DO NOT MODIFY DIRECTLY ONCE FINALIZED)
 * Built by Frontend Owner (@musthafa-cse) to wire widgets and satisfy development verification.
 * Team Lead (@bhavyachawda07) to finalize, merge, and override.
 */

import React, { useState } from 'react';
import { Bell, GraduationCap, RefreshCw, LayoutDashboard, CalendarRange, BarChart3, Inbox } from 'lucide-react';

// Common states
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import SectionHeader from '../components/common/SectionHeader';

// Hooks
import { useDashboard } from '../hooks/useDashboard';
import { useProgress } from '../hooks/useProgress';
import { useActivities } from '../hooks/useActivities';
import { usePerformance } from '../hooks/usePerformance';

// Overview
import WelcomeBanner from '../components/overview/WelcomeBanner';
import DashboardStats from '../components/overview/DashboardStats';
import QuickActions from '../components/overview/QuickActions';
import ProfileCompletionCard from '../components/overview/ProfileCompletionCard';

// Learning Progress
import LearningProgress from '../components/progress/LearningProgress';
import XPProgress from '../components/progress/XPProgress';
import AttendanceCard from '../components/progress/AttendanceCard';

// Activities
import UpcomingActivities from '../components/activities/UpcomingActivities';
import RecentActivities from '../components/activities/RecentActivities';

// Performance
import PerformanceSummary from '../components/performance/PerformanceSummary';

// Notifications
import AnnouncementCard from '../components/notifications/AnnouncementCard';
import NotificationPreview from '../components/notifications/NotificationPreview';

export const DashboardPage = () => {
  // Tabs for the main panel: 'overview' | 'progress' | 'performance'
  const [activeTab, setActiveTab] = useState('overview');
  // Notification preview panel state
  const [showNotifications, setShowNotifications] = useState(false);

  // Invoke hooks
  const dashboard = useDashboard();
  const progress = useProgress();
  const activities = useActivities();
  const performance = usePerformance();

  // Aggregate loading and error states
  const isLoading = dashboard.isLoading || progress.isLoading || activities.isLoading || performance.isLoading;
  
  // Choose the first available error to present in ErrorState
  const errorMsg = dashboard.error || progress.error || activities.error || performance.error;

  const handleRefetchAll = () => {
    dashboard.refetch();
    progress.refetch();
    activities.refetch();
    performance.refetch();
  };

  const handleQuickAction = (actionId) => {
    console.log(`[Quick Action Triggered] id: ${actionId}`);
    if (actionId === 'study') {
      setActiveTab('progress');
    } else if (actionId === 'grades') {
      setActiveTab('performance');
    } else if (actionId === 'schedule') {
      alert('Redirecting to full Class Schedule calendar view.');
    } else if (actionId === 'profile') {
      alert('Opening Profile Settings Modal.');
    }
  };

    // Notification actions delegated to the useDashboard hook
  const handleMarkAllRead = () => {
    dashboard.markAllRead();
  };

  const handleNotificationClick = (id) => {
    dashboard.markAsRead(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-bg flex items-center justify-center p-6">
        <LoadingSpinner message="Booting Aura Academy student engine..." />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-space-bg flex items-center justify-center p-6">
        <ErrorState 
          title="Engine Boot Failure" 
          message={errorMsg} 
          onRetry={handleRefetchAll} 
        />
      </div>
    );
  }

  // Safe checks for loaded state
  const student = dashboard.data?.student || {};
  const stats = dashboard.data?.statistics || {};
  const notifications = dashboard.data?.notifications || [];

  return (
    <div className="min-h-screen bg-space-bg text-gray-100 pb-12 relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-neon-indigo/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-violet/5 blur-3xl pointer-events-none"></div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-space-bg/85 backdrop-blur-md border-b border-space-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-neon-indigo to-neon-violet shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-violet">
              AURA ACADEMY
            </span>
            <span className="text-[9px] text-gray-500 font-bold block leading-none uppercase">Student Console</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'progress' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" /> Learning Progress
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'performance' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Grades & Ranks
          </button>
        </nav>

        {/* Right Nav Action elements */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/5 text-gray-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-coral animate-ping"></span>
              )}
            </button>

            {/* Notifications Dropdown Panel Overlay */}
            {showNotifications && (
              <NotificationPreview
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAllRead={handleMarkAllRead}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </div>

          <button 
            onClick={handleRefetchAll}
            className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-white/5 text-gray-300 hover:text-white transition-all transform active:rotate-180 duration-500"
            title="Refresh System"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Quick Info */}
          <div className="flex items-center gap-2.5 pl-4 border-l border-space-border">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-gray-200 block">{student.name}</span>
              <span className="text-[10px] text-neon-cyan font-semibold uppercase">{student.major}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 space-y-6">
        
        {activeTab === 'overview' && (
          <>
            {/* Welcome Block Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              <div className="lg:col-span-3">
                <WelcomeBanner student={student} statistics={stats} />
              </div>
              <div>
                <ProfileCompletionCard completionPercentage={student.profileCompletion} />
              </div>
            </div>

            {/* Action center bar */}
            <div className="w-full">
              <QuickActions onActionTrigger={handleQuickAction} />
            </div>

            {/* Dashboard Stats */}
            <div className="w-full">
              <DashboardStats statistics={stats} />
            </div>
          </>
        )}

        {/* Mobile Navigation bar tabs */}
        <div className="flex md:hidden bg-slate-900/60 border border-white/5 p-1 rounded-xl w-full justify-between">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-md' : 'text-gray-400'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg ${
              activeTab === 'progress' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-md' : 'text-gray-400'
            }`}
          >
            Progress
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg ${
              activeTab === 'performance' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-md' : 'text-gray-400'
            }`}
          >
            Grades
          </button>
        </div>

        {/* Content Splitting Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Focus Tab Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <SectionHeader 
                  title="Academy Overview" 
                  subtitle="Unified glance at your study modules and learning statistics"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <XPProgress xpData={progress.data?.xp} />
                  <AttendanceCard attendanceData={progress.data?.attendance} />
                </div>
                
                <LearningProgress progressData={progress.data} />
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <SectionHeader 
                  title="Course Milestone Tracker" 
                  subtitle="Detailed audit of modules completed, XP counts and classroom attendance"
                />
                <LearningProgress progressData={progress.data} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <XPProgress xpData={progress.data?.xp} />
                  <AttendanceCard attendanceData={progress.data?.attendance} />
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <SectionHeader 
                  title="Academic Performance Desk" 
                  subtitle="View cumulative grade points, rank progressions and recent quiz evaluations"
                />
                <PerformanceSummary performanceData={performance.data} />
              </div>
            )}
          </div>

          {/* Auxiliary Sidebar Column */}
          <div className="space-y-6">
            <SectionHeader 
              title="Activity & Bulletins" 
              subtitle="Keep track of due assignments and live classrooms"
            />
            
            <UpcomingActivities 
              activities={activities.data?.upcoming} 
              onActionTrigger={(action, activity) => {
                alert(`Action "${action}" triggered for: "${activity.title}"`);
              }}
            />

            <AnnouncementCard 
              notifications={notifications} 
              onMarkAsRead={handleNotificationClick} 
            />

            <RecentActivities activities={activities.data?.recent} />
          </div>

        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
