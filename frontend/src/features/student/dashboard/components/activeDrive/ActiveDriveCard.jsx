import { activeDriveData } from "../../types/dashboardDummyData";

const ActiveDriveCard = ({ loading = false, error = false }) => {
  if (loading) {
    return <div className="text-gray-500">Loading drive...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load drive.</div>;
  }

  const { company, role, package: pkg, deadline, status } = activeDriveData;

  return (
    <div
      className="
        bg-white/90
        backdrop-blur-md
        p-6
        rounded-3xl
        shadow-md
        w-full
        max-w-[360px]
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
      <div
        className="
          inline-block
          px-4
          py-2
          rounded-full
          bg-green-100
          text-green-600
          text-sm
          font-semibold
          mb-5
        "
      >
        {status}
      </div>

      <h2 className="text-3xl font-semibold text-gray-900 mb-3">{company}</h2>

      <p className="text-gray-600 mb-3">
        Role: <strong>{role}</strong>
      </p>

      <p className="text-gray-600 mb-3">
        Package: <strong>{pkg}</strong>
      </p>

      <p className="text-gray-600 mb-6">
        Deadline: <strong>{deadline}</strong>
      </p>

      <button
        className="
          w-full
          bg-gradient-to-r
          from-blue-500
          to-blue-400
          text-white
          py-3
          rounded-xl
          font-semibold
          shadow-md
          transition-all
          duration-300
          hover:opacity-90
        "
      >
        Apply Now
      </button>
    </div>
  );
};

export default ActiveDriveCard;
