import { Eye, Trash2, Calendar, HardDrive, DownloadCloud } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DownloadReport from "../export/DownloadReport";
import { formatDate } from "../../utils/reportsHelpers";

export const ReportCard = ({ 
  report, 
  onPreview, 
  onDelete, 
  onDownload, 
  downloadingId 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-light text-primary px-2 py-0.5 rounded">
            {report.type}
          </span>
          <StatusBadge status={report.status} />
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-800 text-base mb-1.5 line-clamp-1">{report.reportName}</h4>
        
        {/* Description */}
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Scope Filters Metadata */}
        <div className="flex flex-wrap gap-1.5 mb-4 border-t border-slate-50 pt-3">
          {report.department && report.department !== "All Departments" && (
            <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded">
              Dept: {report.department}
            </span>
          )}
          {report.company && report.company !== "All Companies" && (
            <span className="px-2 py-0.5 bg-orange-50 text-[10px] font-bold text-primary rounded">
              {report.company}
            </span>
          )}
          {report.batch && (
            <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded">
              Batch: {report.batch}
            </span>
          )}
        </div>
      </div>

      <div>
        {/* Statistics Row */}
        <div className="flex items-center text-[11px] font-semibold text-slate-400 mb-4 bg-slate-50 rounded-xl px-3 py-2 gap-3">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{formatDate(report.generatedOn)}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            <HardDrive className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{report.size || "1.2 MB"}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <DownloadCloud className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{report.downloadCount || 0} dl</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
          <button
            onClick={() => onPreview(report)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl transition duration-150 cursor-pointer min-w-0"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Preview</span>
          </button>
          
          <div className="shrink-0">
            <DownloadReport
              onClick={() => onDownload(report)}
              isDownloading={downloadingId === report.reportName}
              label="Get"
            />
          </div>

          <button
            onClick={() => onDelete(report.id)}
            className="shrink-0 p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition duration-150 cursor-pointer"
            title="Delete Report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
