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
    <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
        {href ? <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600" /> : null}
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</div> : null}
    </div>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

function SectionCard({ title, subtitle, icon: Icon, href, actionText = "View all", children, className = "" }) {
  return (
    <section className={`h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 px-5 py-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {Icon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p> : null}
          </div>
        </div>
        {href ? (
          <Link to={href} className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            {actionText} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </section>
  );
}

function EmptyBlock({ children }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function ProgressBar({ value }) {
  const percent = clamp(value);
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
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
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0b0f19] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-44 rounded-3xl bg-white dark:bg-[#111827]" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl bg-white dark:bg-[#111827]" />)}
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="h-80 rounded-2xl bg-white dark:bg-[#111827] lg:col-span-2" />
            <div className="h-80 rounded-2xl bg-white dark:bg-[#111827]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0b0f19] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header banner */}
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-black ring-4 ring-white/10">
                {initials(name)}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Student dashboard • SM-03</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Welcome back, {name} 👋</h1>
                <p className="mt-1 text-sm text-blue-100">{email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/student/profile" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50 transition">
                <UserRound className="mr-1.5 inline h-4 w-4" /> Profile
              </Link>
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/15 disabled:opacity-60 transition"
              >
                <RefreshCw className={`mr-1.5 inline h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
            <span>{error}</span>
            <button type="button" onClick={() => loadDashboard(true)} className="font-bold underline">Retry</button>
          </div>
        ) : null}

        {profileError ? (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs font-medium text-amber-700 dark:text-amber-300">
            {profileError} You can still use the rest of the dashboard.
          </div>
        ) : null}

        {/* Top KPI row */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard icon={Trophy} label="Overall score" value={`${overallScore}%`} helper="Across graded activity" href="/student/performance" />
          <MetricCard icon={FileText} label="Assignments done" value={stats.assignmentsCompleted ?? 0} helper="Submitted / completed" href="/student/assignments" />
          <MetricCard icon={Video} label="Sessions attended" value={stats.sessionsAttended ?? 0} helper={`Attendance ${attendance}`} href="/student/sessions" />
          <MetricCard icon={Code2} label="Coding solved" value={stats.codingProblemsSolved ?? 0} helper="Positive-score submissions" href="/student/coding-challenges" />
        </section>

        {/* Academic Overview: Learning Progress & Profile Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="lg:col-span-2">
            <SectionCard title="Learning progress" subtitle="Course/module progress from your learning activity" icon={BookOpen} href="/student/courses">
              <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center my-auto">
                <div className="relative flex h-32 w-32 items-center justify-center mx-auto md:mx-0">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-600 dark:text-blue-500" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" strokeDasharray={`${courseProgress},100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-900 dark:text-white">{Math.round(courseProgress)}%</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-4 text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                      <span>Modules completed</span><span>{progress.modulesCompleted ?? 0} / {progress.totalModules ?? 0}</span>
                    </div>
                    <ProgressBar value={courseProgress} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Assessments taken</div>
                      <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{stats.assessmentsTaken ?? 0}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Courses completed</div>
                      <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{stats.coursesCompleted ?? 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="lg:col-span-1">
            <SectionCard title="Profile readiness" subtitle="Keep your placement profile complete" icon={UserRound} href="/student/profile">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white">{profileCompletion}%</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Profile completion</div>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="mt-4"><ProgressBar value={profileCompletion} /></div>
                  <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{completionMessage}</p>
                </div>
                <div className="mt-4 pt-2">
                  {profileCompletion < 100 ? (
                    <Link to="/student/profile" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm">
                      Complete profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> 100% Profile Complete
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Daily Activities: Upcoming Sessions, Pending Work, Recent Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <SectionCard title="Upcoming sessions" subtitle="Your next live learning events" icon={CalendarDays} href="/student/sessions">
            {!sessions.length ? (
              <EmptyBlock>No upcoming sessions scheduled.</EmptyBlock>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {sessions.slice(0, 3).map((session, index) => (
                  <Link
                    key={`${session.id || session.scheduledAt || "session"}-${index}`}
                    to="/student/sessions"
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-3.5 transition-all duration-150 hover:border-blue-300 dark:hover:border-blue-600/60 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {display(session.title, "Live session")}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="truncate">{formatDate(session.scheduledAt, true)}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500 truncate">
                        {display(session.mentor || session.mentorName, "Mentor not specified")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Pending work" subtitle="Assignments you still need to complete" icon={FileText} href="/student/assignments">
            {!tasks.length ? (
              <EmptyBlock>You have no pending assignments right now.</EmptyBlock>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {tasks.slice(0, 3).map((task, index) => (
                  <Link
                    key={`${task.taskId || task.id || "task"}-${index}`}
                    to="/student/assignments"
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-3.5 transition-all duration-150 hover:border-blue-300 dark:hover:border-blue-600/60 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {display(task.title, "Assignment")}
                        </div>
                        <span className="shrink-0 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/60 dark:border-red-800/50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                          {formatDate(task.dueAt)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                        {display(task.subject, "Assignment")}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600/90 dark:text-amber-400/90">
                        <Clock3 className="h-3 w-3 shrink-0" />
                        <span>Due {formatDate(task.dueAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Recent notifications" subtitle="Latest updates for your account" icon={Bell} href="/student/notifications">
            {!notifications.length ? (
              <EmptyBlock>No recent notifications.</EmptyBlock>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {notifications.slice(0, 3).map((notification, index) => (
                  <Link
                    key={`${notification.id || "notification"}-${index}`}
                    to="/student/notifications"
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-3.5 transition-all duration-150 hover:border-blue-300 dark:hover:border-blue-600/60 hover:bg-blue-50/30 dark:hover:bg-slate-800/40 hover:shadow-sm"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {display(notification.title, "Notification")}
                        </div>
                        <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {display(notification.message, "You have a new notification.")}
                      </div>
                      <div className="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
                        View details →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Career & Community: Placement Journey & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="lg:col-span-2">
            <SectionCard title="Placement journey" subtitle="Your latest active recruitment drive" icon={Target} href="/student/placement">
              {activeDriveTitle ? (
                <div className="flex-1 flex flex-col justify-between rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Active drive</div>
                      <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{activeDriveTitle}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{display(activeDrive?.companyName, "Company not specified")}</p>
                    </div>
                    {activeDriveStage ? <span className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">{activeDriveStage}</span> : null}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white/70 dark:bg-slate-900/60 p-3 border border-slate-200/50 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Current stage</div>
                      <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{display(activeDrive?.currentStage || activeDrive?.status)}</div>
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-slate-900/60 p-3 border border-slate-200/50 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Stage updated</div>
                      <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{formatDate(activeDrive?.stageUpdatedAt)}</div>
                    </div>
                    <div className="rounded-xl bg-white/70 dark:bg-slate-900/60 p-3 border border-slate-200/50 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Application deadline</div>
                      <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{formatDate(activeDrive?.applicationDeadline)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3">
                    <Target className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No active placement drive currently assigned</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">Complete your profile, pass your module assessments, and check back soon for campus placement drives.</p>
                  <Link to="/student/placement" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    Explore placement dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </SectionCard>
          </div>

          <div className="lg:col-span-1">
            <SectionCard title="Leaderboard" subtitle="Current active-drive ranking" icon={Trophy} href="/student/performance">
              {!leaderboard.length ? (
                <EmptyBlock>Leaderboard data is not available yet.</EmptyBlock>
              ) : (
                <div className="space-y-2 flex-1 flex flex-col justify-start">
                  {leaderboard.slice(0, 5).map((entry, index) => {
                    const rankNum = Number(entry.rank) || index + 1;
                    const isTop1 = rankNum === 1;
                    const isTop2 = rankNum === 2;
                    const isTop3 = rankNum === 3;
                    return (
                      <div
                        key={`${entry.rank || index}-${entry.studentName || entry.name || "student"}`}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition ${
                          entry.isSelf
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50/80 dark:bg-blue-950/40 ring-1 ring-blue-400/30"
                            : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                              isTop1
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                                : isTop2
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                : isTop3
                                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-500"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {rankNum}
                          </div>
                          <div className="truncate text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                            {display(entry.studentName || entry.name, "Student")}
                            {entry.isSelf ? <span className="ml-1 text-xs font-semibold text-blue-600 dark:text-blue-400">(You)</span> : null}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">{entry.score ?? entry.completion ?? 0}</div>
                          <div className="text-[10px] text-slate-400">score</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Next best action banner (Footer area, background #4F46E5) */}
        <section
          className="student-next-action-card w-full rounded-2xl p-6 sm:p-7 shadow-lg text-white transition-all"
          style={{ backgroundColor: "#4F46E5" }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
                  Next best action
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {nearestTask ? `Finish ${nearestTask.title}` : profileCompletion < 100 ? "Complete your student profile" : "Keep building your learning momentum"}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                {nearestTask ? `Due ${formatDate(nearestTask.dueAt)}.` : profileCompletion < 100 ? "A complete profile makes your academic and placement information easier to use across Pragati." : "Use the dashboard shortcuts to continue learning, attend sessions, and review your performance."}
              </p>
            </div>
            <Link
              to={nearestTask ? "/student/assignments" : "/student/profile"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-150 active:scale-95"
              style={{ backgroundColor: "#ffffff", color: "#4F46E5" }}
            >
              {nearestTask ? "Open assignments" : "Open profile"}
              <ArrowRight className="h-4 w-4" style={{ color: "#4F46E5" }} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
