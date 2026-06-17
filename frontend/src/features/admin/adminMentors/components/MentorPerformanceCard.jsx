const MentorPerformanceCard = ({
  title,
  value,
  color,
}) => {
  return (
    <div
      className={`rounded-xl p-5 border ${color}`}
    >
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
};

export default MentorPerformanceCard;