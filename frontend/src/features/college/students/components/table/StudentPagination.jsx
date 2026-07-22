import { PAGE_SIZE_OPTIONS } from "../../constants/studentConstants"

const StudentPagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange, darkMode }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={`rounded-lg px-2 py-1 text-sm outline-none cursor-pointer ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-gray-300' : 'border border-gray-200'}`}
        >
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span>per page • Showing {start}–{end} of {totalItems}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            darkMode ? 'border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          ‹ Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer ${
              p === currentPage
                ? "bg-[#ff6d34] text-white border-[#ff6d34]"
                : darkMode
                  ? "border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            darkMode ? 'border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}

export default StudentPagination