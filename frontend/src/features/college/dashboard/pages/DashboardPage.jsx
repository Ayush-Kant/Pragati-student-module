import { useDashboardData } from '../hooks/useDashboardData';
import {
  GraduationCap, Briefcase, Gift, Building2,
  TrendingUp, CalendarDays, Bell, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        {change && (
          <p className="text-xs font-semibold text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {change} from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
    </div>
  );
}

// ── Placement Overview Chart ───────────────────────────────────────────────
const placementChartData = [
  { month: 'Jan', offers: 20, placed: 15 },
  { month: 'Feb', offers: 35, placed: 28 },
  { month: 'Mar', offers: 50, placed: 40 },
  { month: 'Apr', offers: 65, placed: 55 },
  { month: 'May', offers: 75, placed: 60 },
  { month: 'Jun', offers: 90, placed: 80 },
];

// ── Top Recruiting Companies ───────────────────────────────────────────────
const topCompanies = [
  { name: 'TCS',       offers: 24, logo: 'T', color: 'bg-blue-100 text-blue-700' },
  { name: 'Infosys',   offers: 18, logo: 'I', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Wipro',     offers: 14, logo: 'W', color: 'bg-purple-100 text-purple-700' },
  { name: 'Accenture', offers: 12, logo: 'A', color: 'bg-red-100 text-red-700' },
  { name: 'Cognizant', offers: 10, logo: 'C', color: 'bg-teal-100 text-teal-700' },
];

// ── Placement Statistics (Pie) ─────────────────────────────────────────────
const pieData = [
  { name: 'Software Engineer', value: 45, color: '#3b82f6' },
  { name: 'Data Analyst',      value: 25, color: '#f59e0b' },
  { name: 'Product Manager',   value: 20, color: '#10b981' },
  { name: 'Others',            value: 10, color: '#e5e7eb' },
];

// ── Recent Activities ──────────────────────────────────────────────────────
const recentActivities = [
  { icon: '🏢', text: 'New placement drive by TCS',           time: '2 hours ago',  color: 'bg-blue-50' },
  { icon: '🎓', text: 'Student John Doe placed in Infosys',   time: '5 hours ago',  color: 'bg-green-50' },
  { icon: '📋', text: 'New internship opportunity added',      time: '1 day ago',    color: 'bg-yellow-50' },
  { icon: '✅', text: 'Assessment drive completed',           time: '2 days ago',   color: 'bg-purple-50' },
  { icon: '🚌', text: 'Campus drive by Wipro',                time: '3 days ago',   color: 'bg-orange-50' },
];

// ── Upcoming Drives ────────────────────────────────────────────────────────
const upcomingDrives = [
  { company: 'TCS',    role: 'Software Engineer', date: '25 Jun 2026', logo: 'T', color: 'bg-blue-100 text-blue-700' },
  { company: 'Infosys',role: 'System Engineer',   date: '28 Jun 2026', logo: 'I', color: 'bg-indigo-100 text-indigo-700' },
  { company: 'Wipro',  role: 'Project Engineer',  date: '02 Jul 2026', logo: 'W', color: 'bg-purple-100 text-purple-700' },
];

// ── Notifications ──────────────────────────────────────────────────────────
const notifications = [
  { icon: '🏢', text: 'New company registered: Amazon',          time: '1 hour ago',  color: 'bg-blue-50' },
  { icon: '📅', text: 'Placement drive scheduled for next week', time: '3 hours ago', color: 'bg-yellow-50' },
  { icon: '📄', text: 'Monthly report generated',                time: '1 day ago',   color: 'bg-green-50' },
];

// ── DashboardPage ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isLoading, error } = useDashboardData();

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
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening with your college.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 font-medium shadow-sm">
          <CalendarDays size={16} className="text-gray-400 shrink-0" />
          21 May 2026 – 20 Jun 2026
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students"   value="2,450" change="12.5%" icon={GraduationCap} iconBg="bg-blue-50"   iconColor="text-blue-500" />
        <StatCard title="Active Placements" value="128"  change="8.3%"  icon={Briefcase}     iconBg="bg-orange-50" iconColor="text-orange-500" />
        <StatCard title="Offers Made"      value="96"   change="16.2%" icon={Gift}           iconBg="bg-green-50"  iconColor="text-green-500" />
        <StatCard title="Companies Visited" value="58"  change="10.1%" icon={Building2}      iconBg="bg-purple-50" iconColor="text-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Placement Overview Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Placement Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={placementChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Line type="monotone" dataKey="offers"  stroke="#ff7a00" strokeWidth={2} dot={{ r: 3 }} name="Offers Made" />
              <Line type="monotone" dataKey="placed"  stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Students Placed" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-0.5 bg-[#ff7a00] rounded-full block" /> Offers Made
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-0.5 bg-blue-500 rounded-full block" /> Students Placed
            </div>
          </div>
        </div>

        {/* Top Recruiting Companies */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Top Recruiting Companies</h3>
            <button className="text-xs text-[#ff7a00] font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {topCompanies.map(({ name, offers, logo, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${color}`}>
                    {logo}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{name}</span>
                </div>
                <span className="text-xs font-bold text-gray-500">{offers} Offers</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Statistics Pie */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Placement Statistics</h3>
          <div className="flex flex-col items-center">
            <div className="relative">
              <PieChart width={130} height={130}>
                <Pie data={pieData} cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xl font-extrabold text-gray-900">128</p>
                <p className="text-[9px] text-gray-400 font-medium">Total Offers</p>
              </div>
            </div>
            <div className="w-full space-y-1.5 mt-2">
              {pieData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-gray-600 truncate max-w-[110px]">{name}</span>
                  </div>
                  <span className="font-bold text-gray-700">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map(({ icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${color}`}>
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Drives */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Upcoming Drives</h3>
            <button className="text-xs text-[#ff7a00] font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {upcomingDrives.map(({ company, role, date, logo, color }, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${color}`}>
                  {logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{company}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
                <p className="text-[11px] text-gray-500 font-medium shrink-0">{date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
            <button className="text-xs text-[#ff7a00] font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {notifications.map(({ icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${color}`}>
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
