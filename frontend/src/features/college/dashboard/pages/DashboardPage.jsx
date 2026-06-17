import { useDashboardData } from '../hooks/useDashboardData';
import {
  GraduationCap, Briefcase, Building2, Users,
  TrendingUp, CalendarDays,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

// ── Icon map for stat cards ────────────────────────────────────────────────
const STAT_ICONS = {
  'Total Students':  { icon: GraduationCap, bg: 'bg-blue-50',   color: 'text-blue-500'   },
  'Active Drives':   { icon: Building2,     bg: 'bg-orange-50', color: 'text-orange-500' },
  'Placements':      { icon: Briefcase,     bg: 'bg-green-50',  color: 'text-green-500'  },
  'Revenue':         { icon: TrendingUp,    bg: 'bg-teal-50',   color: 'text-teal-500'   },
  'Companies':       { icon: Building2,     bg: 'bg-purple-50', color: 'text-purple-500' },
  'Applications':    { icon: Users,         bg: 'bg-pink-50',   color: 'text-pink-500'   },
};

// ── Pie chart data (from dashboardDummyData placement data) ───────────────
const PIE_DATA = [
  { name: 'Placed',      value: 61, color: '#3b82f6' },
  { name: 'In Process',  value: 25, color: '#f59e0b' },
  { name: 'Not Started', value: 14, color: '#e5e7eb' },
];

// ── Top companies derived from activities ─────────────────────────────────
const TOP_COMPANIES = [
  { name: 'TCS',       offers: 24, initials: 'T', bg: 'bg-blue-100',   text: 'text-blue-700'   },
  { name: 'Infosys',   offers: 18, initials: 'I', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { name: 'Wipro',     offers: 14, initials: 'W', bg: 'bg-purple-100', text: 'text-purple-700' },
  { name: 'Accenture', offers: 12, initials: 'A', bg: 'bg-red-100',    text: 'text-red-700'    },
  { name: 'Cognizant', offers: 10, initials: 'C', bg: 'bg-teal-100',   text: 'text-teal-700'   },
];

// ── Status color map for activities ───────────────────────────────────────
const STATUS_STYLES = {
  success: { dot: 'bg-green-500',  bg: 'bg-green-50'  },
  info:    { dot: 'bg-blue-500',   bg: 'bg-blue-50'   },
  warning: { dot: 'bg-yellow-500', bg: 'bg-yellow-50' },
  error:   { dot: 'bg-red-500',    bg: 'bg-red-50'    },
};

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, change }) {
  const meta = STAT_ICONS[title] ?? { icon: TrendingUp, bg: 'bg-gray-50', color: 'text-gray-400' };
  const Icon = meta.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        {change && (
          <p className="text-xs font-semibold text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={11} /> {change} from last month
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
        <Icon size={20} className={meta.color} />
      </div>
    </div>
  );
}

// ── DashboardPage ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    dashboardStats,
    activities,
    placementData,
    isLoading,
    error,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7a00] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium">
        {error}
      </div>
    );
  }

  // chart data from hook (placementData from dummy)
  const chartData = placementData.map(d => ({ month: d.month, placements: d.placements }));

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back! Here's what's happening with your college.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-medium shadow-sm shrink-0">
          <CalendarDays size={15} className="text-gray-400 shrink-0" />
          21 May 2026 – 20 Jun 2026
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboardStats.map(stat => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} change={stat.change} />
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Placement Overview line chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Placement Overview</h3>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="placements"
                stroke="#ff7a00"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Placements"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
            <span className="w-3 h-0.5 bg-[#ff7a00] rounded-full block" />
            Placements
          </div>
        </div>

        {/* Top Recruiting Companies */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Top Recruiting Companies</h3>
          <div className="space-y-3">
            {TOP_COMPANIES.map(({ name, offers, initials, bg, text }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${bg} ${text}`}>
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-400">{offers} Offers</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Statistics donut */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Placement Statistics</h3>
          <div className="flex flex-col items-center">
            <div className="relative">
              <PieChart width={120} height={120}>
                <Pie
                  data={PIE_DATA}
                  cx={55} cy={55}
                  innerRadius={35} outerRadius={52}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-lg font-extrabold text-gray-900">423</p>
                <p className="text-[9px] text-gray-400">Total</p>
              </div>
            </div>
            <div className="w-full space-y-1.5 mt-3">
              {PIE_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-gray-600">{name}</span>
                  </div>
                  <span className="font-bold text-gray-700">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Activities — from dummy data */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {activities.map(({ id, title, description, time, status }) => {
              const s = STATUS_STYLES[status] ?? STATUS_STYLES.info;
              return (
                <div key={id} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 leading-snug">{title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Updates — from dummy data */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {[
              { id: 1, title: 'Campus Placement Week',      date: '15 June 2026' },
              { id: 2, title: 'New Dashboard Release',      date: '20 June 2026' },
              { id: 3, title: 'Student Verification Drive', date: '25 June 2026' },
            ].map(({ id, title, date }) => (
              <div key={id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <p className="text-sm font-semibold text-gray-700">{title}</p>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
