import { LockKeyhole } from 'lucide-react';

export default function LessonLockBadge({ reason = 'Complete the previous lesson to unlock this lesson.' }) {
  return (
    <span
      title={reason}
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500"
    >
      <LockKeyhole size={11} /> Locked
    </span>
  );
}
