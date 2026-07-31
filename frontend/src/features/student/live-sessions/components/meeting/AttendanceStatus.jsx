import { attendanceBadgeTone } from "../../utils/liveSessionHelpers";

const STYLES = {
  present: "bg-emerald-500/10 text-emerald-400",
  absent: "bg-red-500/10 text-red-400",
  late: "bg-amber-500/10 text-amber-400",
  pending: "bg-slate-500/10 text-slate-400",
};

/** Small live indicator shown inside/near the meeting UI while a session is active. */
export default function AttendanceStatus({ attendance }) {
  const tone = attendanceBadgeTone(attendance);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Attendance: {attendance}
    </span>
  );
}
