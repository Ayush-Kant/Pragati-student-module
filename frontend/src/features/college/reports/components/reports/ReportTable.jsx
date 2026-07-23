import { useState, useMemo } from "react";
import { Eye, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DownloadReport from "../export/DownloadReport";
import { formatDate } from "../../utils/reportsHelpers";

export const ReportTable = ({ 
  reports, 
  onPreview, 
  onDelete, 
  onDownload, 
  downloadingId,
  darkMode 
}) => {
  const [sortField, setSortField] = useState("generatedOn");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to desc on new fields
    }
    setCurrentPage(1);
  };

  const sortedReports = useMemo(() => {
    const list = [...reports];
    return list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null/undefined values
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      // Handle numeric IDs or downloadCount
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      // Default string comparison
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [reports, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedReports.slice(start, start + itemsPerPage);
  }, [sortedReports, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col h-full ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-slate-100 shadow-sm'}`}>
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className={`border-b ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-slate-50 border-slate-150'}`}>
              <th 
                onClick={() => handleSort("reportName")}
                className={`p-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group ${darkMode ? 'text-gray-400 hover:bg-[#1A1A1A]' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <div className="flex items-center space-x-1">
                  <span>Report Name</span>
                  <ArrowUpDown className={`w-3 h-3 transition ${darkMode ? 'text-gray-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort("type")}
                className={`p-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group ${darkMode ? 'text-gray-400 hover:bg-[#1A1A1A]' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <ArrowUpDown className={`w-3 h-3 transition ${darkMode ? 'text-gray-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort("generatedOn")}
                className={`p-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group ${darkMode ? 'text-gray-400 hover:bg-[#1A1A1A]' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <div className="flex items-center space-x-1">
                  <span>Generated On</span>
                  <ArrowUpDown className={`w-3 h-3 transition ${darkMode ? 'text-gray-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                </div>
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider select-none ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Scope & Tags
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider select-none ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Status
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider select-none ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Size
              </th>
              <th className={`p-4 text-xs font-semibold uppercase tracking-wider text-right select-none ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-[#3D3D3D]' : 'divide-slate-100'}`}>
            {paginatedReports.map((report) => (
              <tr key={report.id} className={`transition duration-150 ${darkMode ? 'border-b border-[#3D3D3D] hover:bg-[#1A1A1A]/50' : 'border-b border-slate-50 hover:bg-slate-50/50'}`}>
                <td className="p-4">
                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{report.reportName}</div>
                  <div className={`text-xs font-medium truncate max-w-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{report.description}</div>
                </td>
                <td className={`p-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{report.type}</td>
                <td className={`p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {formatDate(report.generatedOn)}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {report.department && report.department !== "All Departments" && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded">
                        {report.department}
                      </span>
                    )}
                    {report.company && report.company !== "All Companies" && (
                      <span className="px-1.5 py-0.5 bg-orange-50 text-[10px] font-bold text-primary rounded">
                        {report.company}
                      </span>
                    )}
                    {report.batch && (
                      <span className="px-1.5 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded">
                        Yr {report.batch}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={report.status} />
                </td>
                <td className={`p-4 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{report.size || "1.2 MB"}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onPreview(report)}
                      className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${darkMode ? 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
                      title="Preview Report Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <DownloadReport
                      onClick={() => onDownload(report)}
                      isDownloading={downloadingId === report.id}
                      isIcon={true}
                      darkMode={darkMode}
                    />
                    <button
                      onClick={() => onDelete(report.id)}
                      className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-[#1A1A1A]' : 'bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600'}`}
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-between p-4 mt-auto ${darkMode ? 'bg-[#1A1A1A]/50 border-t border-[#3D3D3D]' : 'bg-slate-50/50 border-t border-slate-100'}`}>
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedReports.length)} of {sortedReports.length} reports
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-40 ${darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D] hover:bg-[#1A1A1A] text-gray-400' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-40 ${darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D] hover:bg-[#1A1A1A] text-gray-400' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
