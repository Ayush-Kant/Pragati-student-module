import React from "react";

const SearchFilter = ({
  value,
  onChange,
  placeholder = "Search...",
  darkMode,
}) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:ring-2 ${
          darkMode
            ? 'border border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:ring-[#ff6d34] focus:border-[#ff6d34]'
            : 'border border-gray-300 focus:ring-orange-400 focus:border-orange-400'
        }`}
      />
    </div>
  );
};

export default SearchFilter;