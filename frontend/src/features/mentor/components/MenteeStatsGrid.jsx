import React from "react";
import { Users, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

export default function MenteeStatsGrid({ stats = {} }) {
  const { total = 0, active = 0, completed = 0, urgent = 0 } = stats;

  const statCards = [
    {
      title: "TOTAL STUDENTS",
      value: total,
      badgeText: "ALL TIME",
      badgeClass: "bg-blue-50 text-blue-600 border border-blue-100",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
      valueColor: "text-blue-700",
    },
    {
      title: "ACTIVE",
      value: active,
      badgeText: "ACTIVE NOW",
      badgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      valueColor: "text-emerald-700",
    },
    {
      title: "COMPLETED",
      value: completed,
      badgeText: "COMPLETED",
      badgeClass: "bg-purple-50 text-purple-600 border border-purple-100",
      icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-50",
      valueColor: "text-purple-700",
    },
    {
      title: "NEED HELP",
      value: urgent,
      badgeText: "URGENT",
      badgeClass: "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse",
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      iconBg: "bg-rose-50",
      valueColor: "text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            {/* Styled Icon Wrapper */}
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
              {card.icon}
            </div>
            
            {/* Small status pill */}
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${card.badgeClass}`}>
              {card.badgeText}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <h3 className={`mt-1 text-3xl font-extrabold tracking-tight ${card.valueColor}`}>
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
