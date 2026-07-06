const ProgressCard = ({ label, value, total, color = "bg-blue-500" }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-t-4 border-t-blue-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <p className="text-gray-500 text-sm mb-3 font-medium">{label}</p>
      <p className="text-3xl font-bold text-blue-500 mb-3">{value}</p>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{percentage}% of {total}</p>
    </div>
  );
};

export default ProgressCard;
