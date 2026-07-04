import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Users, Briefcase, Building2,
  BarChart2, FileText, GraduationCap, Bell, ChevronDown,
  Menu, X, Settings, HelpCircle, LogOut, Building
} from 'lucide-react';
import logo from '../../../assets/logo.png';

// ── Navigation config matching the design ──────────────────────────────────
const NAV_MAIN = [
  { label: 'Dashboard',       path: '/college/dashboard', icon: LayoutDashboard },
  { label: 'Profile',         path: '/college/profile',   icon: User },
  { label: 'Students',        path: '/college/students',  icon: Users },
  { label: 'Placements',      path: '/college/placements',icon: Briefcase },
  { label: 'Drive Management',path: '/college/drives',    icon: Building2 },
  { label: 'Assessments',     path: '/college/assessments',icon: GraduationCap },
  { label: 'Analytics',       path: '/college/analytics', icon: BarChart2 },
  { label: 'Reports',         path: '/college/reports',   icon: FileText },
];

const NAV_MANAGEMENT = [
  { label: 'Faculty',     path: '/college/faculty',     icon: User },
  { label: 'Companies',   path: '/college/companies',   icon: Building },
  { label: 'Internships', path: '/college/internships', icon: Briefcase },
];

const NAV_ACCOUNT = [
  { label: 'Settings',      path: '/college/settings',  icon: Settings },
  { label: 'Help & Support', path: '/college/help',     icon: HelpCircle },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ onClose = null }) {
  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 shrink-0">
        <img src={logo} alt="Uptoskills" className="h-8 w-auto" onError={e => { e.target.onerror=null; e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
        <span className="hidden text-xl font-extrabold text-[#ff7a00]">Uptoskills</span>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 ml-2">
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* MAIN */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Main</p>
          <ul className="space-y-0.5">
            {NAV_MAIN.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#fff4ec] text-[#ff7a00] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* MANAGEMENT */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Management</p>
          <ul className="space-y-0.5">
            {NAV_MANAGEMENT.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#fff4ec] text-[#ff7a00] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Account</p>
          <ul className="space-y-0.5">
            {NAV_ACCOUNT.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#fff4ec] text-[#ff7a00] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <LogOut size={17} className="shrink-0" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-40 shadow-sm">
      {/* Hamburger (mobile) */}
      <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <Menu size={22} className="text-gray-600" />
      </button>
      <div className="hidden md:block" />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">5</span>
        </button>

        {/* Profile chip */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">ABC Engineering College</p>
            <p className="text-xs text-gray-500">College Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        </div>
      </div>
    </header>
  );
}

// ── CollegeLayout ──────────────────────────────────────────────────────────
export function CollegeLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col fixed inset-y-0 left-0 z-30 w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 mt-16 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CollegeLayout;
