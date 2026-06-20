const StatCard = ({ title, value }) => {
  return (
    <div
      className="
        bg-white/90
        backdrop-blur-md
        p-6
        rounded-2xl
        shadow-md
        min-h-[140px]
        text-center
        border
        border-gray-200
        border-t-4
        border-t-blue-500
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        cursor-pointer
      "
    >
      <h3 className="text-gray-500 text-base mb-4 font-medium">{title}</h3>

      <p className="text-4xl font-bold text-blue-500">{value}</p>
    </div>
  );
};

export default StatCard;
