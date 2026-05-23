import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { QuickStatsBar } from './components/dashboard/QuickStatsBar';
import { ActiveDriveCard } from './components/dashboard/ActiveDriveCard';
import { UpcomingSessionsList } from './components/dashboard/UpcomingSessionsList';
import { PendingTasksList } from './components/dashboard/PendingTasksList';
import { LeaderboardPreview } from './components/dashboard/LeaderboardPreview';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 text-slate-800 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        
        {/* Section 1: Dashboard Header (Greeting card & Date) */}
        <DashboardHeader />

        {/* Section 2: Quick Metrics Stats */}
        <QuickStatsBar />

        {/* Section 3: Active Recruitment Drive & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ActiveDriveCard />
          <UpcomingSessionsList />
        </div>

        {/* Section 4: Pending Tasks & Batch Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <PendingTasksList />
          <LeaderboardPreview />
        </div>

      </div>
    </div>
  );
}
