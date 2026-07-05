import React from "react";
import StatsCard from "./StatsCard";
import {
  Users,
  Briefcase,
  Building2,
  Award,
  GraduationCap,
  Layers,
  ClipboardList,
  Percent
} from "lucide-react";
const localStats = [
  {
    id: 1,
    title: "Total Students",
    value: "1,250",
    change: "+12%",
    trend: "up"
  },
  {
    id: 2,
    title: "Active Drives",
    value: "18",
    change: "+4%",
    trend: "up"
  },
  {
    id: 3,
    title: "Companies",
    value: "42",
    change: "+8%",
    trend: "up"
  },
  {
    id: 4,
    title: "Placements",
    value: "320",
    change: "+15%",
    trend: "up"
  },
  {
    id: 5,
    title: "Faculty",
    value: "65",
    change: "+2%",
    trend: "up"
  },
  {
    id: 6,
    title: "Departments",
    value: "12",
    change: "0%",
    trend: "neutral"
  },
  {
    id: 7,
    title: "Internships",
    value: "74",
    change: "+10%",
    trend: "up"
  },
  {
    id: 8,
    title: "Placement Rate",
    value: "86%",
    change: "+5%",
    trend: "up"
  }
];

const iconMap = {
  "Total Students": {
    icon: Users,
    iconBg: "bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-600 border border-indigo-100/80"
  },
  "Active Drives": {
    icon: Briefcase,
    iconBg: "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100/80"
  },
  "Companies": {
    icon: Building2,
    iconBg: "bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-600 border border-violet-100/80"
  },
  "Placements": {
    icon: Award,
    iconBg: "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 border border-amber-100/80"
  },
  "Faculty": {
    icon: GraduationCap,
    iconBg: "bg-gradient-to-br from-sky-50 to-blue-50 text-sky-600 border border-sky-100/80"
  },
  "Departments": {
    icon: Layers,
    iconBg: "bg-gradient-to-br from-rose-50 to-pink-50 text-rose-600 border border-rose-100/80"
  },
  "Internships": {
    icon: ClipboardList,
    iconBg: "bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 border border-teal-100/80"
  },
  "Placement Rate": {
    icon: Percent,
    iconBg: "bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 border border-indigo-100/80"
  }
};

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {localStats.map((stat) => {
        const config = iconMap[stat.title] || {
          icon: Users,
          iconBg: "bg-gradient-to-br from-gray-50 to-slate-50 text-slate-600 border border-slate-100"
        };
        return (
          <StatsCard
            key={stat.id || stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={config.icon}
            iconBg={config.iconBg}
          />
        );
      })}
    </div>
  );
};

export default StatsGrid;