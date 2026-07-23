const DateFilter = ({
    selectedDate,
    setSelectedDate,
    darkMode,
  }) => {
    return (
      <div className="w-full md:w-52">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2 text-sm shadow-sm outline-none transition focus:ring-2 ${
            darkMode
              ? 'border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20'
              : 'border-gray-300 bg-white text-gray-700 focus:border-[#ff7a00] focus:ring-[#ff7a00]/20'
          }`}
        />
      </div>
    );
  };
  
  export default DateFilter;