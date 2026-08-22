import { Eye, Trash2, Calendar, HardDrive, DownloadCloud } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DownloadReport from "../export/DownloadReport";
import { formatDate } from "../../utils/reportsHelpers";

export const ReportCard = ({ 
  report, 
  onPreview, 
  onDelete, 
  onDownload, 
  downloadingId,
  darkMode 
}) => {
  return (
    <div className={`rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] hover:border-[#4D4D4D] shadow-sm' : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'}`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-light text-primary px-2 py-0.5 rounded">
            {report.type}
          </span>
          <StatusBadge status={report.status} />
        </div>

        {/* Title */}
        <h4 className={`font-bold text-base mb-1.5 line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{report.reportName}</h4>
        
        {/* Description */}
        <p className={`text-xs font-medium leading-relaxed mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {report.description}
        </p>

        {/* Scope Filters Metadata */}
        <div className={`flex flex-wrap gap-1.5 mb-4 pt-3 ${darkMode ? 'border-t border-[#3D3D3D]' : 'border-t border-slate-50'}`}>
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
        <div className={`flex items-center text-[11px] font-semibold mb-4 rounded-xl px-3 py-2 gap-3 ${darkMode ? 'text-gray-500 bg-[#1A1A1A]' : 'text-slate-400 bg-slate-50'}`}>
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
        <div className={`flex items-center justify-between gap-2 pt-3 ${darkMode ? 'border-t border-[#3D3D3D]' : 'border-t border-slate-50'}`}>
          <button
            onClick={() => onPreview(report)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition duration-150 cursor-pointer min-w-0 ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#3D3D3D] text-gray-300 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800'}`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Preview</span>
          </button>
          
          <div className="shrink-0">
            <DownloadReport
              onClick={() => onDownload(report)}
              isDownloading={downloadingId === report.id}
              label="Get"
              darkMode={darkMode}
            />
          </div>

          <button
            onClick={() => onDelete(report.id)}
            className={`shrink-0 p-2 rounded-xl transition duration-150 cursor-pointer ${darkMode ? 'bg-[#1A1A1A] hover:bg-red-900/30 text-gray-400 hover:text-red-400' : 'bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600'}`}
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
