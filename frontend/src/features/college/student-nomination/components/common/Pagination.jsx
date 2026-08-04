import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const { darkMode = false } = useOutletContext() || {};

  // Ensure valid minimum bounds
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

  if (safeTotalPages <= 1 && totalItems <= pageSizeOptions[0]) return null;

  // Safe Page Change Execution
  const handlePageClick = (page) => {
    if (typeof page === "number" && page !== safeCurrentPage) {
      const safePage = Math.max(1, Math.min(page, safeTotalPages));
      onPageChange?.(safePage);
    }
  };

  // Helper to generate dynamic page range buttons
  const getPageNumbers = () => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      return [
        1,
        "...",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      safeTotalPages,
    ];
  };

  const pages = getPageNumbers();

  // Calculate current visible range
  const startRange = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endRange = Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
      {/* 1. Page Size Selector & Record Count */}
      <div className="flex items-center gap-4 text-xs md:text-sm">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
              Rows per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-medium border focus:outline-none transition-colors ${
                darkMode
                  ? "bg-[#2D2D2D] border-[#3D3D3D] text-white focus:border-[#ff7a00]"
                  : "bg-white border-slate-200 text-slate-700 focus:border-[#ff7a00]"
              }`}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {totalItems > 0 && (
          <span className={`font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Showing <span className={darkMode ? "text-white" : "text-slate-800"}>{startRange}</span>–
            <span className={darkMode ? "text-white" : "text-slate-800"}>{endRange}</span> of{" "}
            <span className={darkMode ? "text-white" : "text-slate-800"}>{totalItems}</span>
          </span>
        )}
      </div>

      {/* 2. Pagination Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          disabled={safeCurrentPage <= 1}
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          aria-label="Previous Page"
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
            safeCurrentPage <= 1
              ? "cursor-not-allowed opacity-40 border-transparent"
              : "hover:scale-105 active:scale-95"
          } ${
            darkMode
              ? "bg-[#2D2D2D] text-gray-300 border-[#3D3D3D] hover:bg-[#3D3D3D]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-7 text-center text-slate-400 font-semibold select-none text-xs"
                >
                  ...
                </span>
              );
            }

            const isSelected = safeCurrentPage === page;

            return (
              <button
                key={`page-${page}`}
                onClick={() => handlePageClick(page)}
                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-[#ff7a00] text-white border-[#ff7a00] shadow-md shadow-orange-500/20"
                    : darkMode
                    ? "bg-[#2D2D2D] text-gray-300 border-[#3D3D3D] hover:bg-[#3D3D3D]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          aria-label="Next Page"
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
            safeCurrentPage >= safeTotalPages
              ? "cursor-not-allowed opacity-40 border-transparent"
              : "hover:scale-105 active:scale-95"
          } ${
            darkMode
              ? "bg-[#2D2D2D] text-gray-300 border-[#3D3D3D] hover:bg-[#3D3D3D]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;