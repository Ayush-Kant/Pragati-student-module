import React from "react";
import { Download, RefreshCw, Sparkles } from "lucide-react";
import { formatDate } from "../../utils/reportsHelpers";

export const ReportHistory = ({ reports }) => {
  // Generate a mock history timeline based on current reports list
  const historyItems = React.useMemo(() => {
    if (!reports || reports.length === 0) return [];
    
    const logs = [];
    
    // Sort reports by generated date desc
    const sorted = [...reports].sort((a, b) => new Date(b.generatedOn) - new Date(a.generatedOn));
    
    sorted.forEach((report) => {
      // Log for generation
      logs.push({
        id: `gen-${report.id}`,
        timestamp: report.generatedOn,
        title: `Report Generated: ${report.reportName}`,
        description: `Successfully compiled the ${report.type} report for ${report.department || "All Departments"}. File size: ${report.size || "1.2 MB"}.`,
        operator: report.generatedBy || "System Operator",
        icon: Sparkles,
        iconBg: "bg-orange-50 text-primary border-orange-100",
      });

      // Log for downloads (if any)
      if (report.downloadCount > 0) {
        logs.push({
          id: `dl-${report.id}`,
          timestamp: report.generatedOn, // Simulating close time
          title: `Report Downloaded: ${report.reportName}`,
          description: `Document retrieved ${report.downloadCount} times as CSV Spreadsheet layout format.`,
          operator: "Placement Officer Admin",
          icon: Download,
          iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        });
      }
    });

    // Add a baseline log
    logs.push({
      id: "baseline",
      timestamp: "2026-10-01",
      title: "Reports Database Initialized",
      description: "College Career Portal reports generation framework compiled and connected to schema validations.",
      operator: "System Architect",
      icon: RefreshCw,
      iconBg: "bg-slate-100 text-slate-500 border-slate-200",
    });

    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);
  }, [reports]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
      <h4 className="font-bold text-slate-800 text-base mb-1">Activity Log & Audit Trail</h4>
      <p className="text-xs text-slate-400 font-semibold mb-6">Recent report operations and access tracking records</p>
      
      <div className="relative pl-6 space-y-6 border-l border-slate-100 ml-3 flex-1">
        {historyItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="relative group transition duration-150">
              {/* Timeline dot */}
              <div className={`absolute -left-[37px] top-0 rounded-xl p-1.5 border-2 border-white shadow-sm flex items-center justify-center ${item.iconBg}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              
              {/* Event Content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 hover:text-primary transition">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 sm:mt-0">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  {item.description}
                </p>
                <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                  Operator: <span className="text-slate-600">{item.operator}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportHistory;
