import { formatDate, attendanceBadgeTone } from "../../utils/liveSessionHelpers";

const STYLES = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-red-50 text-red-600",
  late: "bg-amber-50 text-amber-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function AttendanceCard({ record }) {
  const tone = attendanceBadgeTone(record.status);
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{record.title}</p>
        <p className="text-xs text-slate-500">{formatDate(record.date)}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[tone]}`}>
        {record.status}
      </span>
    </div>
  );
}
