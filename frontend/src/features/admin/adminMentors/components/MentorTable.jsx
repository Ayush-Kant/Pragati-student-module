import { useNavigate } from "react-router-dom";
import MentorStatusBadge from "./MentorStatusBadge";
import MentorActionButtons from "./MentorActionButtons";

const MentorTable = ({
  mentors,
  onAssign,
  onReplace,
  onRemove,
}) => {
  const navigate = useNavigate();

  if (!mentors.length) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-600">
          No mentors found
        </h3>

        <p className="text-gray-400 mt-2">
          Try changing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Mentor ID
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Name
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Email
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Expertise
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Rating
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Active Batches
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Status
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {mentors.map((mentor) => (
            <tr
              key={mentor.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-4 text-gray-600">
                {mentor.id}
              </td>

              <td className="p-4">
                <button
                  onClick={() =>
                    navigate(`/admin/mentors/${mentor.id}`)
                  }
                  className="font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                >
                  {mentor.name}
                </button>
              </td>

              <td className="p-4 text-gray-600">
                {mentor.email}
              </td>

              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="bg-sky-100 text-sky-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-medium">
                    {mentor.rating.toFixed(1)}
                  </span>
                </div>
              </td>

              <td className="p-4 font-medium">
                {mentor.activeBatches}
              </td>

              <td className="p-4">
                <MentorStatusBadge
                  isActive={mentor.isActive}
                />
              </td>

              <td className="p-4">
                <MentorActionButtons
                  mentor={mentor}
                  onAssign={onAssign}
                  onReplace={onReplace}
                  onRemove={onRemove}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MentorTable;