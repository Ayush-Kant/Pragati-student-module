import ReportSummaryCards from "./ReportSummaryCards";
import ReportStatistics from "./ReportStatistics";
import RecentReports from "./RecentReports";
import ReportHistory from "../reports/ReportHistory";

export const ReportsDashboard = ({ 
  reports, 
  statistics, 
  onPreviewReport, 
  onDownloadReport, 
  downloadingId,
  onNavigateToReports,
  darkMode 
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Statistics Summary Tiles */}
      <ReportSummaryCards statistics={statistics} darkMode={darkMode} />

      {/* 2. Custom Visual Chart Vector Rows */}
      <ReportStatistics reports={reports} darkMode={darkMode} />

      {/* 3. Bottom Double-Grid: Recent Reports list & Activity Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentReports 
          reports={reports} 
          onPreview={onPreviewReport}
          onDownload={onDownloadReport}
          downloadingId={downloadingId}
          onViewAll={onNavigateToReports}
          darkMode={darkMode}
        />
        
        <ReportHistory reports={reports} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default ReportsDashboard;
