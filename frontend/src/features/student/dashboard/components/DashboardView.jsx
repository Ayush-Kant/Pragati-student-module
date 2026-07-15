import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData'; // Adjust path to your team's hook
import StatCard from './stats/StatCard';
import TaskCard from './tasks/TaskCard';
import ProgressRing from './progress/ProgressRing';

function DashboardView() {
  // 💡 Real React/JS implementation using your team's actual custom hook:
  const { data, loading, error } = useDashboardData();

  // Handle API loading states using JavaScript conditional rendering
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
        Loading dashboard metrics...
      </div>
    );
  }

  // Handle API error states gracefully
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-red-400">
        ⚠️ Failed to load dashboard data. Please refresh or try again later.
      </div>
    );
  }

  // Extract values dynamically from the API response data object
  const stats = data?.stats || { coursesCompleted: 0, attendance: '0%', xp: '0 XP' };
  const tasks = data?.tasks || [];
  const completionProgress = data?.progress || 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome back, Student! 👋
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Here is an overview of your current learning milestones and deliverables.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-400">Overview Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard title="Courses Completed" value={stats.coursesCompleted} icon="📚" description="Target: 6 Modules" />
            <StatCard title="Attendance Rate" value={stats.attendance} icon="📅" description="Minimum required: 85%" />
            <StatCard title="Experience Points" value={stats.xp} icon="⚡" description="+150 XP this week" />
          </div>
        </div>

        {/* Main Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Progress Module */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-sm font-medium text-gray-400 mb-6">Track Completion Progress</h3>
            <div className="my-4 flex items-center justify-center">
              <ProgressRing radius={60} stroke={10} progress={completionProgress} />
            </div>
            <p className="text-sm font-semibold text-emerald-400 mt-4">
              {completionProgress}% of Module 3 Completed
            </p>
          </div>

          {/* Tasks List Module */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Upcoming Tasks & Deadlines</h3>
            <div className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No upcoming deliverables! 🎉</p>
              ) : (
                tasks.map((task) => (
                  <TaskCard 
                    key={task.id || task._id}
                    title={task.title}
                    deadline={task.deadline}
                    priority={task.priority}
                  />
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardView;