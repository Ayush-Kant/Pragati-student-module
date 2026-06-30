import React from 'react';

const StatsCard = ({ title, value, change, icon, iconColorClass }) => {
  return (
    <div className="flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
      {icon && (
        <div className={`flex items-center justify-center p-3 mr-4 rounded-full ${iconColorClass}`}>
          <span className="text-xl">{icon}</span>
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-1 text-xs ${change?.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
          {change}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;