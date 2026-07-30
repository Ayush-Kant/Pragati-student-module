import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const ReviewStatus = ({ status }) => {
  const config = {
    reviewed: {
      label: 'Evaluation Approved & Reviewed',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    'needs-revision': {
      label: 'Revisions Requested by Mentor',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: AlertCircle,
    },
    pending: {
      label: 'Pending Mentor Evaluation',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
  };

  const current = config[status] || config.pending;
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${current.color}`}>
      <Icon className="w-4 h-4" />
      {current.label}
    </div>
  );
};

export default ReviewStatus;
