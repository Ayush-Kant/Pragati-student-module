import React from "react";
import { Eye, DownloadCloud, ChevronRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/reportsHelpers";

export const RecentReports = ({ reports, onPreview, onDownload, downloadingId, onViewAll, darkMode }) => {
  const latestReports = React.useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.generatedOn) - new Date(a.generatedOn))
      .slice(0, 4);
  }, [reports]);

  return (
    <div className={`rounded-2xl p-6 flex flex-col h-full ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-slate-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-800'}`}>Recent Reports</h4>
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
      <p className={`text-xs font-semibold mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Latest report templates generated in the placement portal</p>
      
      <div className="space-y-4 flex-1">
        {latestReports.length === 0 ? (
          <div className={`py-8 text-center text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>No reports generated today.</div>
        ) : (
          latestReports.map((report) => (
            <div 
              key={report.id} 
              className={`flex items-center justify-between p-3.5 rounded-xl transition border ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#3D3D3D] border-[#3D3D3D]/30' : 'bg-slate-50 hover:bg-slate-100/50 border-slate-100/30'}`}
            >
              <div className="min-w-0 pr-3">
                <h5 className={`text-xs font-bold truncate ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{report.reportName}</h5>
                <div className={`flex items-center space-x-2 text-[10px] font-semibold mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  <span className="uppercase text-primary font-bold">{report.type}</span>
                  <span>•</span>
                  <span>{formatDate(report.generatedOn)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <StatusBadge status={report.status} />
                <button
                  onClick={() => onPreview(report)}
                  className={`p-1 rounded-lg transition border cursor-pointer ${darkMode ? 'bg-[#2D2D2D] hover:bg-[#1A1A1A] text-gray-400 hover:text-white border-[#3D3D3D]/50' : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200/50'}`}
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDownload(report)}
                  disabled={downloadingId === report.id}
                  className={`p-1 rounded-lg transition border cursor-pointer disabled:opacity-55 ${darkMode ? 'bg-[#2D2D2D] hover:bg-[#ff6d34]/10 text-gray-400 hover:text-[#ff6d34] border-[#3D3D3D]/50' : 'bg-white hover:bg-orange-50 text-slate-500 hover:text-primary border-slate-200/50'}`}
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
