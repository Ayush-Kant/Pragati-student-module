import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { darkMode } = useOutletContext();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    // Small number of pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // End
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-6 grid grid-cols-[150px_1fr_150px] items-center">
      {/* Previous */}

      <div className="justify-self-start">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : ""
          } ${
            darkMode
              ? "bg-[#151D30] hover:bg-slate-700"
              : "bg-white hover:bg-slate-100"
          }`}
        >
          <ChevronLeft size={18} />
          Previous
        </button>
      </div>

      {/* Numbers */}

      <div className="flex items-center justify-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="w-8 text-center text-slate-400 font-semibold"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-xl font-medium transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-md"
                  : darkMode
                  ? "bg-[#151D30] hover:bg-slate-700"
                  : "bg-white hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}

      <div className="justify-self-end">
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            currentPage === totalPages
              ? "cursor-not-allowed opacity-50"
              : ""
          } ${
            darkMode
              ? "bg-[#151D30] hover:bg-slate-700"
              : "bg-white hover:bg-slate-100"
          }`}
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;