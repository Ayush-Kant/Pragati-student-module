import React from "react";

const DriveStatisticsCard = ({ title, value, icon: Icon, colorClass, borderClass }) => {
  return (
    <div className={`flex items-center justify-between p-5 bg-white border ${borderClass} rounded-2xl shadow-sm transition-all hover:shadow-md`}>
      <div className="space-y-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
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
