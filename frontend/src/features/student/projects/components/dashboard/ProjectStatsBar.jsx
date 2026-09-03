import { FolderOpen, TrendingUp, CheckCircle2, AlertCircle, Star } from 'lucide-react';

const ProjectStatsBar = ({ stats = {} }) => {
  const items = [
    { label: 'Total', value: Number(stats.total || 0), icon: FolderOpen, tone: 'text-slate-700', iconTone: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'In Progress', value: Number(stats.inProgress || 0), icon: TrendingUp, tone: 'text-slate-700', iconTone: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: Number(stats.completed || 0), icon: CheckCircle2, tone: 'text-slate-700', iconTone: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Overdue', value: Number(stats.overdue || 0), icon: AlertCircle, tone: 'text-slate-700', iconTone: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Evaluated', value: Number(stats.evaluated || 0), icon: Star, tone: 'text-slate-700', iconTone: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map(({ label, value, icon: Icon, tone, iconTone, bg }) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className={`mb-3 inline-flex rounded-lg p-2 ${bg} ${iconTone}`}><Icon size={17} /></div>
          <p className={`text-2xl font-bold ${tone}`}>{value}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectStatsBar;
