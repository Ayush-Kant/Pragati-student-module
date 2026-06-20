import { skillsBreakdownData } from "../../types/dashboardDummyData";

const ProgressLegend = ({ loading = false, error = false }) => {
  if (loading) {
    return <div className="text-gray-500">Loading skills...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load skills.</div>;
  }

  return (
    <div
      className="
        bg-white/90
        backdrop-blur-md
        p-6
        rounded-3xl
        shadow-md
        w-full
        max-w-[260px]
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
      <h3
        className="
          mb-6
          text-gray-900
          text-2xl
          font-semibold
        "
      >
        Skills Breakdown
      </h3>

      {skillsBreakdownData.map((item, index) => (
        <div key={index} className="mb-5">
          <div className="flex justify-between mb-2">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: item.value,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressLegend;
