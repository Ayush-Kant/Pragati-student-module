import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination control for the challenge list.
 *
 * @param {{
 *   currentPage: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 * }} props
 */
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  /**
   * Build an array of page numbers / ellipsis tokens to display.
   * Always shows first, last, and pages within 1 of current.
   */
  const buildPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = buildPages();

  return (
    <nav
      aria-label="Challenge list pagination"
      className="flex items-center justify-center gap-1 mt-8"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Go to previous page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400
          border border-gray-800 hover:border-gray-600 hover:text-gray-200
          disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={15} aria-hidden="true" />
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 py-2 text-sm text-gray-600 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                : 'border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Go to next page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400
          border border-gray-800 hover:border-gray-600 hover:text-gray-200
          disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <ChevronRight size={15} aria-hidden="true" />
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
