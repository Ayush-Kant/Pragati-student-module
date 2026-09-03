import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  FileText,
  GraduationCap,
  RefreshCw,
  Target,
  Trophy,
  UserRound,
  Video,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";
import { fetchDashboardData } from "../services/dashboardService";
import studentProfileService from "../../services/studentProfile.service";

const EMPTY_DASHBOARD = {
  activeDrive: null,
  stats: {},
  progress: {},
  upcomingSessions: [],
  pendingTasks: [],
  leaderboard: [],
  notifications: [],
  student: {},
};

const safeArray = (value) => (Array.isArray(value) ? value : []);
const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, Number(value) || 0));
const display = (value, fallback = "Not available") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const formatDate = (value, withTime = false) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return withTime
    ? date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
};

const initials = (name) =>
  String(name || "Student")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

function MetricCard({ icon: Icon, label, value, helper, href }) {
  const content = (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        {href ? <ArrowRight className="h-4 w-4 text-slate-300" /> : null}
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

function SectionCard({ title, subtitle, icon: Icon, href, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {href ? (
          <Link to={href} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyBlock({ children }) {
  return <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{children}</div>;
}

function ProgressBar({ value }) {
  const percent = clamp(value);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function SM03DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    setProfileError("");

    try {
      const [dashboardResult, profileResult] = await Promise.allSettled([
        fetchDashboardData(),
        studentProfileService.getMyProfile(),
      ]);

      if (dashboardResult.status === "rejected") {
        throw dashboardResult.reason;
      }

      setDashboard({ ...EMPTY_DASHBOARD, ...(dashboardResult.value || {}) });

      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value || null);
      } else {
        setProfile(null);
        setProfileError(profileResult.reason?.response?.data?.message || "Profile completion could not be loaded.");
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const student = dashboard.student || {};
  const stats = dashboard.stats || {};
  const progress = dashboard.progress || {};
  const sessions = safeArray(dashboard.upcomingSessions);
  const tasks = safeArray(dashboard.pendingTasks);
  const leaderboard = safeArray(dashboard.leaderboard);
  const notifications = safeArray(dashboard.notifications);

  const name = display(student.name, user?.name || "Student");
  const email = display(student.email, user?.email || "");
  const profileCompletion = clamp(profile?.profileCompleteness);
  const courseProgress = clamp(progress.completionPercent ?? progress.overallPercentage);
  const attendance = display(stats.attendanceRate, "0%");
  const overallScore = Number(stats.overallScore) || 0;

  const nearestTask = useMemo(() => {
    return tasks
      .slice()
      .sort((a, b) => new Date(a.dueAt || 0).getTime() - new Date(b.dueAt || 0).getTime())[0];
  }, [tasks]);

  const activeDrive = dashboard.activeDrive;
  const activeDriveTitle = activeDrive?.title || activeDrive?.driveName;
  const activeDriveStage = activeDrive?.currentStage || activeDrive?.status || activeDrive?.enrollmentStatus;

  const completionMessage = useMemo(() => {
    if (profileCompletion >= 90) return "Your profile is nearly placement-ready.";
    if (profileCompletion >= 70) return "You are close to a complete placement profile.";
    if (profileCompletion > 0) return "Complete your profile to improve your placement readiness.";
    return "Start completing your profile to unlock a stronger student presence.";
  }, [profileCompletion]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-44 rounded-3xl bg-white" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl bg-white" />)}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="h-80 rounded-2xl bg-white lg:col-span-2" />
            <div className="h-80 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <main className="mx-auto max-w-7xl space-y-5">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-black ring-4 ring-white/10">
                {initials(name)}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Student dashboard • SM-03</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Welcome back, {name} 👋</h1>
                <p className="mt-1 text-sm text-blue-100">{email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/student/profile" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50">
                <UserRound className="mr-1.5 inline h-4 w-4" /> Profile
              </Link>
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/15 disabled:opacity-60"
              >
                <RefreshCw className={`mr-1.5 inline h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => loadDashboard(true)} className="font-bold underline">Retry</button>
          </div>
        ) : null}

        {profileError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
            {profileError} You can still use the rest of the dashboard.
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard icon={Trophy} label="Overall score" value={`${overallScore}%`} helper="Across graded activity" href="/student/performance" />
          <MetricCard icon={FileText} label="Assignments done" value={stats.assignmentsCompleted ?? 0} helper="Submitted / completed" href="/student/assignments" />
          <MetricCard icon={Video} label="Sessions attended" value={stats.sessionsAttended ?? 0} helper={`Attendance ${attendance}`} href="/student/sessions" />
          <MetricCard icon={Code2} label="Coding solved" value={stats.codingProblemsSolved ?? 0} helper="Positive-score submissions" href="/student/coding-challenges" />
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <SectionCard title="Placement journey" subtitle="Your latest active recruitment drive" icon={Target} href="/student/placement">
              {activeDriveTitle ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Active drive</div>
                      <h3 className="mt-1 text-xl font-black text-slate-900">{activeDriveTitle}</h3>
                      <p className="mt-1 text-sm text-slate-500">{display(activeDrive?.companyName, "Company not specified")}</p>
                    </div>
                    {activeDriveStage ? <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">{activeDriveStage}</span> : null}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Current stage</div><div className="mt-1 text-sm font-bold text-slate-800">{display(activeDrive?.currentStage || activeDrive?.status)}</div></div>
                    <div><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Stage updated</div><div className="mt-1 text-sm font-bold text-slate-800">{formatDate(activeDrive?.stageUpdatedAt)}</div></div>
                    <div><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Application deadline</div><div className="mt-1 text-sm font-bold text-slate-800">{formatDate(activeDrive?.applicationDeadline)}</div></div>
                  </div>
                </div>
              ) : (
                <EmptyBlock>No active placement drive is currently assigned.</EmptyBlock>
              )}
            </SectionCard>

            <SectionCard title="Learning progress" subtitle="Course/module progress from your learning activity" icon={BookOpen} href="/student/courses">
              <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" stroke="currentColor" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-600" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" strokeDasharray={`${courseProgress},100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-900">{Math.round(courseProgress)}%</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-4 text-sm font-bold text-slate-800">
                      <span>Modules completed</span><span>{progress.modulesCompleted ?? 0} / {progress.totalModules ?? 0}</span>
                    </div>
                    <ProgressBar value={courseProgress} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Assessments taken</div><div className="mt-1 text-xl font-black text-slate-900">{stats.assessmentsTaken ?? 0}</div></div>
                    <div className="rounded-xl bg-slate-50 p-3"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Courses completed</div><div className="mt-1 text-xl font-black text-slate-900">{stats.coursesCompleted ?? 0}</div></div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="grid gap-5 md:grid-cols-2">
              <SectionCard title="Upcoming sessions" subtitle="Your next live learning events" icon={CalendarDays} href="/student/sessions">
                {!sessions.length ? <EmptyBlock>No upcoming sessions scheduled.</EmptyBlock> : (
                  <div className="space-y-3">
                    {sessions.slice(0, 4).map((session, index) => (
                      <div key={`${session.id || session.scheduledAt || "session"}-${index}`} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Clock3 className="h-4 w-4" /></div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-slate-800">{display(session.title, "Live session")}</div>
                          <div className="mt-1 text-xs text-slate-500">{formatDate(session.scheduledAt, true)}</div>
                          <div className="mt-1 text-xs text-slate-400">{display(session.mentor || session.mentorName, "Mentor not specified")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Pending work" subtitle="Assignments you still need to complete" icon={FileText} href="/student/assignments">
                {!tasks.length ? <EmptyBlock>You have no pending assignments right now.</EmptyBlock> : (
                  <div className="space-y-3">
                    {tasks.slice(0, 4).map((task, index) => (
                      <Link key={`${task.taskId || task.id || "task"}-${index}`} to="/student/assignments" className="block rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-800">{display(task.title, "Assignment")}</div><div className="mt-1 text-xs text-slate-500">{display(task.subject, "Assignment")}</div></div>
                          <span className="shrink-0 rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">{formatDate(task.dueAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>

          <div className="space-y-5">
            <SectionCard title="Profile readiness" subtitle="Keep your placement profile complete" icon={UserRound} href="/student/profile">
              <div className="flex items-center justify-between gap-4">
                <div><div className="text-3xl font-black text-slate-900">{profileCompletion}%</div><div className="text-xs text-slate-500">Profile completion</div></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"><CheckCircle2 className="h-7 w-7" /></div>
              </div>
              <div className="mt-4"><ProgressBar value={profileCompletion} /></div>
              <p className="mt-3 text-xs leading-5 text-slate-500">{completionMessage}</p>
              {profileCompletion < 100 ? <Link to="/student/profile" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Complete profile <ArrowRight className="h-3.5 w-3.5" /></Link> : null}
            </SectionCard>

            <SectionCard title="Leaderboard" subtitle="Current active-drive ranking" icon={Trophy} href="/student/performance">
              {!leaderboard.length ? <EmptyBlock>Leaderboard data is not available yet.</EmptyBlock> : (
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={`${entry.rank || index}-${entry.studentName || entry.name || "student"}`} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${entry.isSelf ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex min-w-0 items-center gap-3"><div className="w-6 text-center text-xs font-black text-slate-400">#{display(entry.rank, index + 1)}</div><div className="truncate text-sm font-bold text-slate-800">{display(entry.studentName || entry.name, "Student")}{entry.isSelf ? " (You)" : ""}</div></div>
                      <div className="shrink-0 text-right"><div className="text-sm font-black text-blue-600">{entry.score ?? entry.completion ?? 0}</div><div className="text-[10px] text-slate-400">score</div></div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Recent notifications" subtitle="Latest updates for your account" icon={Bell} href="/student/notifications">
              {!notifications.length ? <EmptyBlock>No recent notifications.</EmptyBlock> : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <Link key={`${notification.id || "notification"}-${index}`} to="/student/notifications" className="block rounded-xl border border-slate-200 p-3 hover:border-blue-200 hover:bg-blue-50/30">
                      <div className="flex items-start gap-3"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" /><div className="min-w-0"><div className="text-sm font-bold text-slate-800">{display(notification.title, "Notification")}</div><div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{display(notification.message, "You have a new notification.")}</div><div className="mt-1 text-[10px] text-slate-400">{formatDate(notification.createdAt)}</div></div></div>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Next best action</div>
              <h2 className="mt-1 text-lg font-black text-slate-900">{nearestTask ? `Finish ${nearestTask.title}` : profileCompletion < 100 ? "Complete your student profile" : "Keep building your learning momentum"}</h2>
              <p className="mt-1 text-sm text-slate-500">{nearestTask ? `Due ${formatDate(nearestTask.dueAt)}.` : profileCompletion < 100 ? "A complete profile makes your academic and placement information easier to use across Pragati." : "Use the dashboard shortcuts to continue learning, attend sessions, and review your performance."}</p>
            </div>
            <Link to={nearestTask ? "/student/assignments" : "/student/profile"} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              {nearestTask ? "Open assignments" : "Open profile"}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
