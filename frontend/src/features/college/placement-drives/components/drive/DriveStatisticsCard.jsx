import React from "react";

const DriveStatisticsCard = ({ title, value, icon: Icon, colorClass, borderClass, darkMode }) => {
  return (
    <div className={`flex items-center justify-between p-5 border rounded-2xl shadow-sm transition-all hover:shadow-md ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'} ${borderClass}`}>
      <div className="space-y-1">
        <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </span>
        <h3 className={`text-2xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default DriveStatisticsCard;
