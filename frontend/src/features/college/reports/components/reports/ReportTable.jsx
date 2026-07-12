import React, { useState, useMemo } from "react";
import { Eye, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DownloadReport from "../export/DownloadReport";
import { formatDate } from "../../utils/reportsHelpers";

export const ReportTable = ({ 
  reports, 
  onPreview, 
  onDelete, 
  onDownload, 
  downloadingId 
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150">
              <th 
                onClick={() => handleSort("reportName")}
                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none group"
              >
                <div className="flex items-center space-x-1">
                  <span>Report Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("type")}
                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none group"
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("generatedOn")}
                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none group"
              >
                <div className="flex items-center space-x-1">
                  <span>Generated On</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
                </div>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                Scope & Tags
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                Status
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                Size
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right select-none">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50/50 transition duration-150">
                <td className="p-4">
                  <div className="font-semibold text-slate-800 text-sm">{report.reportName}</div>
                  <div className="text-xs text-slate-400 font-medium truncate max-w-xs">{report.description}</div>
                </td>
                <td className="p-4 text-sm font-medium text-slate-600">{report.type}</td>
                <td className="p-4 text-sm font-medium text-slate-500">
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
                <td className="p-4 text-xs font-semibold text-slate-500">{report.size || "1.2 MB"}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onPreview(report)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition duration-150 cursor-pointer"
                      title="Preview Report Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <DownloadReport
                      onClick={() => onDownload(report)}
                      isDownloading={downloadingId === report.id}
                      isIcon={true}
                    />
                    <button
                      onClick={() => onDelete(report.id)}
                      className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition duration-150 cursor-pointer"
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
        <div className="flex items-center justify-between p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
          <span className="text-xs font-semibold text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedReports.length)} of {sortedReports.length} reports
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition cursor-pointer"
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
