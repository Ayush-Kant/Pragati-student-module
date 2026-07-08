const DateFilter = ({
    selectedDate,
    setSelectedDate,
  }) => {
    return (
      <div className="w-full md:w-52">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20"
        />
      </div>
    );
  };
  
  export default DateFilter;