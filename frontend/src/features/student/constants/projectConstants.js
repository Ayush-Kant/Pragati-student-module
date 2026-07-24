export const STATUS_PENDING = 'Pending';
export const STATUS_SUBMITTED = 'Submitted';
export const STATUS_DEADLINE_PASSED = 'Deadline Passed';
export const STATUS_IN_REVIEW = 'In Review';

export const STATUS_STYLES = {
  [STATUS_PENDING]: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
  },
  [STATUS_SUBMITTED]: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/20',
  },
  [STATUS_DEADLINE_PASSED]: {
    bg: 'bg-coral-500/10',
    text: 'text-pragati-danger',
    border: 'border-pragati-danger/20',
  },
  [STATUS_IN_REVIEW]: {
    bg: 'bg-amber-500/10',
    text: 'text-pragati-accent',
    border: 'border-pragati-accent/20',
  },
};
