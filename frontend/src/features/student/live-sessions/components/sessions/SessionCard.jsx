import { formatDate, statusBadgeTone, attendanceBadgeTone } from "../../utils/liveSessionHelpers";
import JoinSessionButton from "../meeting/JoinSessionButton";

const STATUS_STYLES = {
  upcoming: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  ongoing: "bg-emerald-50 text-emerald-700 ring-emerald-200 animate-pulse",
  completed: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-red-50 text-red-600 ring-red-200",
  default: "bg-slate-100 text-slate-600 ring-slate-200",
};

const ATTENDANCE_STYLES = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-600",
  late: "bg-amber-50 text-amber-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function SessionCard({ session, onViewDetails, onJoin, isJoining }) {
  const statusTone = statusBadgeTone(session.status);
  const attendanceTone = attendanceBadgeTone(session.attendance);

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-slate-900">{session.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[statusTone]}`}
          >
            {session.status}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">by {session.trainer}</p>

        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <p>📅 {formatDate(session.date)}</p>
          <p>
            🕐 {session.time} · {session.duration}
          </p>
        </div>

        <span
          className={`mt-3 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${ATTENDANCE_STYLES[attendanceTone]}`}
        >
          Attendance: {session.attendance}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onViewDetails?.(session)}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          View Details
        </button>
        <JoinSessionButton session={session} onJoin={onJoin} isJoining={isJoining} compact />
      </div>
    </div>
  );
}
