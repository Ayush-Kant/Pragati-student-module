import React from "react";
import { Eye, DownloadCloud, ChevronRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/reportsHelpers";

export const RecentReports = ({ reports, onPreview, onDownload, downloadingId, onViewAll }) => {
  const latestReports = React.useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.generatedOn) - new Date(a.generatedOn))
      .slice(0, 4);
  }, [reports]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-bold text-slate-800 text-base">Recent Reports</h4>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary-hover transition cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 font-semibold mb-6">Latest report templates generated in the placement portal</p>
      
      <div className="space-y-4 flex-1">
        {latestReports.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-semibold">No reports generated today.</div>
        ) : (
          latestReports.map((report) => (
            <div 
              key={report.id} 
              className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition border border-slate-100/30"
            >
              <div className="min-w-0 pr-3">
                <h5 className="text-xs font-bold text-slate-700 truncate">{report.reportName}</h5>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold mt-1">
                  <span className="uppercase text-primary font-bold">{report.type}</span>
                  <span>•</span>
                  <span>{formatDate(report.generatedOn)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <StatusBadge status={report.status} />
                <button
                  onClick={() => onPreview(report)}
                  className="p-1 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition border border-slate-200/50 cursor-pointer"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDownload(report)}
                  disabled={downloadingId === report.id}
                  className="p-1 bg-white hover:bg-orange-50 text-slate-500 hover:text-primary rounded-lg transition border border-slate-200/50 cursor-pointer disabled:opacity-55"
                  title="Download CSV"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;
