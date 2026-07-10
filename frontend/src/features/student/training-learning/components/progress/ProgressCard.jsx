// ProgressCard.jsx
// Small stat card (used in LearningStatistics grid)

const ProgressCard = ({ icon, label, value, accent = "text-blue-600" }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={`text-xl font-bold ${accent}`}>{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default ProgressCard;
