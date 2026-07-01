import PropTypes from "prop-types";
import useDashboardData from "../hooks/useDashboardData";
import LeaderboardPreview from "../components/leaderboard/LeaderboardPreview";




// ── Temporary placeholder cards (Ritika's section) ────
const ActiveDriveCard = ({ data, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🎯 Active Drive</h3>
    {loading ? (
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
    ) : data ? (
      <div>
        <p className="text-sm font-semibold text-gray-800">{data.companyName} — {data.role}</p>
        <p className="text-xs text-gray-400 mt-1">Drive on {data.driveDate}</p>
        <span className="inline-block mt-2 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{data.eligibility}</span>
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">No active drives.</p>
    )}
  </div>
);

const QuickStats = ({ data, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">📊 Quick Stats</h3>
    {loading ? (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
      </div>
    ) : data ? (
      <div className="grid grid-cols-2 gap-3">
        <div><p className="text-xl font-bold text-gray-800">{data.applicationsSubmitted}</p><p className="text-xs text-gray-400">Applications</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.interviewsScheduled}</p><p className="text-xs text-gray-400">Interviews</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.offersReceived}</p><p className="text-xs text-gray-400">Offers</p></div>
        <div><p className="text-xl font-bold text-gray-800">{data.profileCompletion}%</p><p className="text-xs text-gray-400">Profile</p></div>
      </div>
    ) : null}
  </div>
);

const ProgressRing = ({ data, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">📈 Progress</h3>
    {loading ? (
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
    ) : data ? (
      <div className="flex flex-col gap-3">
        {Object.entries(data).map(([key, val]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-semibold text-gray-700">{val}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${val}%` }} />
            </div>
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

// ── Temporary placeholder cards (Mounika's section) ───
const UpcomingSessions = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🗓️ Upcoming Sessions</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-3">
        {data.map((s) => (
          <div key={s.id} className="border-l-2 border-blue-400 pl-3">
            <p className="text-sm font-semibold text-gray-800">{s.title}</p>
            <p className="text-xs text-gray-400">{s.date} · {s.time} · {s.mentor}</p>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No upcoming sessions.</p>}
  </div>
);

const PendingTasks = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">✅ Pending Tasks</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-2">
        {data.map((t) => (
          <div key={t.id} className="flex items-center gap-2 text-sm">
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${t.done ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
              {t.done && "✓"}
            </span>
            <span className={t.done ? "text-gray-400 line-through" : "text-gray-700"}>{t.title}</span>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No pending tasks.</p>}
  </div>
);

const NotificationsList = ({ data = [], loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🔔 Recent Notifications</h3>
    {loading ? (
      <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
    ) : data.length > 0 ? (
      <div className="flex flex-col gap-3">
        {data.map((n) => (
          <div key={n.id} className="flex items-start gap-2">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-gray-300" : "bg-blue-500"}`} />
            <div>
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    ) : <p className="text-sm text-gray-400 italic">No notifications.</p>}
  </div>
);

// ─────────────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────────────

const DashboardPage = () => {
  const {
    activeDrive, quickStats, progressRing,
    upcomingSessions, pendingTasks, leaderboard, recentNotifications,
    loading, error, refetch,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Your placement journey at a glance</p>
          </div>
        </div>

        {/* ── Global Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
            <span>⚠ {error}</span>
            <button onClick={refetch} className="text-xs font-semibold underline">Retry</button>
          </div>
        )}

        {/* ── Top Row — Active Drive + Quick Stats + Progress (Ritika) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <ActiveDriveCard data={activeDrive} loading={loading} />
          <QuickStats data={quickStats} loading={loading} />
          <ProgressRing data={progressRing} loading={loading} />
        </div>

        {/* ── Middle Row — Sessions + Tasks + Notifications (Mounika) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <UpcomingSessions data={upcomingSessions} loading={loading} />
          <PendingTasks data={pendingTasks} loading={loading} />
          <NotificationsList data={recentNotifications} loading={loading} />
        </div>

        {/* ── Bottom Row — Leaderboard (Vaishnavi) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <LeaderboardPreview
              leaderboard={leaderboard}
              loading={loading}
              error={error}
            />
          </div>
          {/* Reserved space for future widgets / extra content */}
          <div className="hidden lg:block lg:col-span-2" />
        </div>

      </div>
    </div>
  );
};
ActiveDriveCard.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

QuickStats.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

ProgressRing.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

UpcomingSessions.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

PendingTasks.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

NotificationsList.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

LeaderboardPreview.propTypes = {
  leaderboard: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default DashboardPage;
