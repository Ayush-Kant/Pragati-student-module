// src/features/student/dashboard/components/DashboardView.jsx
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import ActiveDriveCard from './activeDrive/ActiveDriveCard';
import ProgressRing from './progress/ProgressRing';
import StatCard from './stats/StatCard';
import TaskCard from './tasks/TaskCard';

export default function DashboardView() {
  const dashboardState = useDashboardData();

  // Handle loading fallback safely
  if (!dashboardState) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center bg-slate-950 text-white rounded-2xl p-8">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-slate-400">Loading Student Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800/60 shadow-xl max-w-7xl mx-auto">
      {/* 1. Welcome Header Segment */}
      <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, <span className="text-orange-500">Student</span>! 👋
        </h1>
        <p className="text-sm text-slate-400">Track your progress and upcoming activities below.</p>
      </div>

      {/* 2. Grid for Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardState.quickStats?.map((stat, idx) => (
          <StatCard key={idx} title={stat.title} value={stat.value} />
        )) || <p className="text-xs text-slate-500">No metrics loaded.</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Progress Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Course Progression</h3>
            <div className="flex justify-center py-2">
              <ProgressRing percentage={dashboardState.progressRing?.percentage || 0} />
            </div>
          </div>
          
          {dashboardState.activeDrive && (
            <ActiveDriveCard drive={dashboardState.activeDrive} />
          )}
        </div>

        {/* 4. Pending Tasks Column */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              {dashboardState.pendingTasks?.length > 0 ? (
                dashboardState.pendingTasks.map((task, idx) => (
                  <TaskCard key={idx} task={task} />
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">All tasks completed!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}