import { CheckCircle2, Clock, AlertTriangle, FileCheck } from "lucide-react";

export const StatusBadge = ({ status }) => {
  let badgeStyles = "bg-slate-100 text-slate-700 border-slate-200";
  let Icon = Clock;

  switch (status) {
    case "Completed":
      badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      Icon = CheckCircle2;
      break;
    case "Generated":
      badgeStyles = "bg-sky-50 text-sky-700 border-sky-200/50";
      Icon = FileCheck;
      break;
    case "Pending":
      badgeStyles = "bg-amber-50 text-amber-700 border-amber-200/50";
      Icon = Clock;
      break;
    case "Failed":
      badgeStyles = "bg-red-50 text-red-700 border-red-200/50";
      Icon = AlertTriangle;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyles}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
