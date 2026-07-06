// src/features/student/dashboard/components/DashboardView.jsx
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import QuickStats from './stats/QuickStats';
import ProgressRing from './progress/ProgressRing';
import PendingTasks from './tasks/PendingTasks';

export default function DashboardView() {
  const dashboardState = useDashboardData();

  // Simple safe fallback processing parsing logic
  const attendanceVal = dashboardState?.progressRing?.percentage || 75;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800/60 shadow-xl max-w-7xl mx-auto">
      {/* Welcome Greeting Header */}
      <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, <span className="text-orange-500">Student</span>! 👋
        </h1>
        <p className="text-sm text-slate-400">Track your progress and upcoming activities below.</p>
      </div>

      {/* Quick Statistics Block Components Grid Array */}
      <QuickStats stats={dashboardState?.quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Display Layout column */}
        <div className="lg:col-span-1">
          <ProgressRing percentage={attendanceVal} />
        </div>

        {/* Task Assignment Tracker section list component panel */}
        <div className="lg:col-span-2">
          <PendingTasks tasks={dashboardState?.pendingTasks} />
        </div>
      </div>
    </div>
  );
}