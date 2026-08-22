const SearchStudent = ({ value, onChange, darkMode }) => (
  <div className="relative">
    <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search by name, enrollment, email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`pl-9 pr-4 h-10 w-full md:w-72 rounded-xl text-sm outline-none ${
        darkMode
          ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-gray-300 placeholder-gray-500 focus:border-[#ff6d34]'
          : 'bg-white border border-gray-200 text-gray-600 placeholder:text-gray-400 focus:border-blue-400'
      }`}
    />
  </div>
)

export default SearchStudent