const StatisticsCard = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-blue-600">
        {value}
      </h2>
    </div>
  );
};

export default StatisticsCard;