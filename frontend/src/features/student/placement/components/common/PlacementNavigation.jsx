// src/features/student/placement/components/common/PlacementNavigation.jsx
// Common top tab navigation for the placement module.

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Award,
  Sparkles,
} from 'lucide-react';
import { PLACEMENT_ROUTES } from '../../constants/placementConstants';

export default function PlacementNavigation() {
  const navItems = [
    {
      to: PLACEMENT_ROUTES.DASHBOARD,
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: PLACEMENT_ROUTES.CAREER_PROFILE,
      label: 'Career Profile',
      icon: User,
    },
    {
      to: PLACEMENT_ROUTES.JOB_APPLICATIONS,
      label: 'Job Applications',
      icon: Briefcase,
    },
    {
      to: PLACEMENT_ROUTES.READINESS_REPORT,
      label: 'Readiness Report',
      icon: Award,
    },
  ];

  return (
    <header className="bg-white border-b border-surface-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
          {/* Module Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-surface-900 leading-none">
                  Placement & Career Readiness
                </h1>
                <span className="badge bg-primary-50 text-primary-700 border border-primary-200 text-2xs font-semibold">
                  MOD-09
                </span>
              </div>
              <p className="text-2xs text-surface-400 mt-0.5">
                Pragati Career Suite
              </p>
            </div>
          </div>

          {/* Tab Navigation Links */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-2xs font-bold'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
