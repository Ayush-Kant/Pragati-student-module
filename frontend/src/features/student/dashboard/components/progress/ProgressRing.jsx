import { progressRingData } from "../../types/dashboardDummyData";

const ProgressRing = ({ loading = false, error = false }) => {
  if (loading) {
    return <div className="text-gray-500">Loading progress...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load progress.</div>;
  }

  const { percentage } = progressRingData;

  return (
    <div
      className="
        bg-white/90
        backdrop-blur-md
        p-8
        rounded-3xl
        shadow-md
        flex
        flex-col
        items-center
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
      <h2
        className="
          mb-6
          text-gray-900
          text-2xl
          font-semibold
        "
      >
        Profile Completion
      </h2>

      <div
        className="
          w-[140px]
          h-[140px]
          rounded-full
          flex
          items-center
          justify-center
        "
        style={{
          background: `conic-gradient(#3b82f6 0% ${percentage}%, #bfdbfe ${percentage}% 100%)`,
        }}
      >
        <div
          className="
            w-[96px]
            h-[96px]
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-2xl
            font-bold
            text-gray-900
          "
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
