import { Zap, CheckSquare, Video, Star } from 'lucide-react';
import { Card } from '../ui/card';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  valueColorClass: string;
  iconBgClass: string;
  iconColorClass: string;
  borderColorClass: string;
}

function StatCard({ 
  icon, 
  value, 
  label, 
  valueColorClass, 
  iconBgClass, 
  iconColorClass,
  borderColorClass 
}: StatCardProps) {
  return (
    <Card className={`bg-white border border-slate-100 ${borderColorClass} hover:border-slate-200/80 transition-all duration-300 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center text-center gap-4`}>
      {/* Icon with tinted round background */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} shrink-0 transition-transform duration-300 hover:scale-105`}>
        <div className={iconColorClass}>
          {icon}
        </div>
      </div>

      {/* Value & Label Column */}
      <div className="flex flex-col items-center text-center min-w-0">
        <div className={`text-[1.85rem] font-black leading-none tracking-tight ${valueColorClass}`}>
          {value}
        </div>
        <div className="text-xs text-slate-500 font-semibold mt-1.5 tracking-wide">
          {label}
        </div>
      </div>
    </Card>
  );
}

export function QuickStatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        icon={<Zap className="w-5.5 h-5.5 fill-current" />}
        value="1250"
        label="XP Earned"
        valueColorClass="text-orange-600"
        iconBgClass="bg-orange-50 border border-orange-100"
        iconColorClass="text-orange-600"
        borderColorClass="hover:shadow-[0_8px_30px_rgba(249,115,22,0.08)]"
      />
      <StatCard
        icon={<CheckSquare className="w-5.5 h-5.5" />}
        value="12"
        label="Assignments Done"
        valueColorClass="text-cyan-600"
        iconBgClass="bg-cyan-50 border border-cyan-100"
        iconColorClass="text-cyan-600"
        borderColorClass="hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)]"
      />
      <StatCard
        icon={<Video className="w-5.5 h-5.5 fill-current" />}
        value="8"
        label="Sessions Attended"
        valueColorClass="text-purple-600"
        iconBgClass="bg-purple-50 border border-purple-100"
        iconColorClass="text-purple-600"
        borderColorClass="hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)]"
      />
      <StatCard
        icon={<Star className="w-5.5 h-5.5 fill-current" />}
        value="85%"
        label="Overall Score"
        valueColorClass="text-emerald-600"
        iconBgClass="bg-emerald-50 border border-emerald-100"
        iconColorClass="text-emerald-600"
        borderColorClass="hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]"
      />
    </div>
  );
}
