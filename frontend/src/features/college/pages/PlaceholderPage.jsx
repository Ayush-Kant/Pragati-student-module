import { useLocation } from 'react-router-dom';
import {
  Users, Briefcase, Building2, GraduationCap, BarChart2,
  FileText, User, Building, HelpCircle, Settings, Construction
} from 'lucide-react';

const PAGE_META = {
  '/college/students':    { label: 'Students',        icon: Users,        color: 'bg-blue-50 text-blue-500' },
  '/college/placements':  { label: 'Placements',       icon: Briefcase,    color: 'bg-green-50 text-green-500' },
  '/college/drives':      { label: 'Drive Management', icon: Building2,    color: 'bg-orange-50 text-orange-500' },
  '/college/assessments': { label: 'Assessments',      icon: GraduationCap,color: 'bg-purple-50 text-purple-500' },
  '/college/analytics':   { label: 'Analytics',        icon: BarChart2,    color: 'bg-indigo-50 text-indigo-500' },
  '/college/reports':     { label: 'Reports',          icon: FileText,     color: 'bg-teal-50 text-teal-500' },
  '/college/faculty':     { label: 'Faculty',          icon: User,         color: 'bg-pink-50 text-pink-500' },
  '/college/companies':   { label: 'Companies',        icon: Building,     color: 'bg-yellow-50 text-yellow-500' },
  '/college/internships': { label: 'Internships',      icon: Briefcase,    color: 'bg-red-50 text-red-500' },
  '/college/settings':    { label: 'Settings',         icon: Settings,     color: 'bg-gray-50 text-gray-500' },
  '/college/help':        { label: 'Help & Support',   icon: HelpCircle,   color: 'bg-cyan-50 text-cyan-500' },
};

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { label: 'Coming Soon', icon: Construction, color: 'bg-gray-50 text-gray-400' };
  const Icon = meta.icon;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{meta.label}</h1>
        <p className="text-xs text-gray-500 mt-0.5">Dashboard &rsaquo; {meta.label}</p>
      </div>

      {/* Coming soon card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${meta.color}`}>
          <Icon size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{meta.label}</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          This section is under development. It will be available soon.
        </p>
      </div>
    </div>
  );
}
