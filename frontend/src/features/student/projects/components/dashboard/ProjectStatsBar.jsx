import { FolderOpen, TrendingUp, CheckCircle2, AlertCircle, Star } from 'lucide-react';

/**
 * Stats bar displayed at the top of the projects dashboard.
 * @param {{ stats: object }} props
 */
const ProjectStatsBar = ({ stats }) => {
  const items = [
    { label: 'Total',      value: stats.total,      icon: FolderOpen,   color: 'text-gray-300' },
    { label: 'In Progress',value: stats.inProgress, icon: TrendingUp,   color: 'text-blue-400' },
    { label: 'Completed',  value: stats.completed,  icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Overdue',    value: stats.overdue,    icon: AlertCircle,  color: 'text-red-400' },
    { label: 'Evaluated',  value: stats.evaluated,  icon: Star,         color: 'text-teal-400' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8 animate-slide-up">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-gradient-to-br from-white/3 to-transparent border border-white/6 rounded-2xl p-4 text-center backdrop-blur-sm shadow-md"
        >
          <Icon size={18} className={`mx-auto mb-1 ${color}`} aria-hidden="true" />
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectStatsBar;
