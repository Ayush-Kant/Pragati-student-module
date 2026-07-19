import MentorStatusBadge from "./MentorStatusBadge";
import MentorActionButtons from "./MentorActionButtons";
import { useNavigate } from "react-router-dom";

export default function MentorTable({
  mentors,
  darkMode,
  onMentorRemove = () => {},
  onMentorAssign = () => {},
  onMentorReplace = () => {},
  onStatusToggle = () => {},
}) {
  const navigate = useNavigate();

  const handleMentorRemove = (mentorId) => {
    onMentorRemove(mentorId);
  };

  return (
    <div
      className={`rounded-xl shadow w-full overflow-hidden ${
        darkMode
          ? "bg-slate-950 border border-slate-700"
          : "bg-white border border-slate-200"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-325 table-auto">
          <colgroup>
            <col className="w-28" />
            <col className="w-36" />
            <col className="w-26" />
            <col className="w-48" />
            <col className="w-20" />
            <col className="w-20" />
            <col className="w-28" />
            <col className="w-56" />
          </colgroup>

          <thead>
            <tr
              className={`border-b ${
                darkMode
                  ? "border-slate-700 text-slate-300"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <th className="px-2 py-4 text-left text-sm font-medium">
                Mentor ID
              </th>

              <th className="px-2 py-4 text-left text-sm font-medium">
                Name
              </th>

              <th className="px-2 py-4 text-left text-sm font-medium">
                Email
              </th>

              <th className="px-2 py-4 text-left text-sm font-medium">
                Expertise
              </th>

              <th className="px-2 py-4 text-center text-sm font-medium">
                Rating
              </th>

              <th className="px-2 py-4 text-center text-sm font-medium">
                Active Batches
              </th>

              <th className="px-2 py-4 text-center text-sm font-medium">
                Status
              </th>

              <th className="px-2 py-4 text-center text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {mentors.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className={`px-2 py-10 text-center text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  No mentors found.
                </td>
              </tr>
            ) : (
              mentors.map((mentor) => (
                <tr
                  key={mentor.id}
                  onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
                  className={`border-b cursor-pointer ${
                    darkMode
                      ? "border-slate-800 hover:bg-slate-900"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {/* Mentor ID */}
                  <td
                    className={`px-2 py-4 whitespace-nowrap text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-700"
                    }`}
                  >
                    {mentor.id}
                  </td>

                  {/* Name */}
                  <td
                    className={`px-2 py-4 whitespace-nowrap text-sm ${
                      darkMode ? "text-slate-300" : "text-slate-800"
                    }`}
                  >
                    {mentor.name}
                  </td>

                  {/* Email */}
                  <td
                    className={`px-2 py-4 text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {mentor.email}
                  </td>

                  {/* Expertise */}
                  <td className="px-2 py-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise?.map((exp, index) => (
                        <span
                          key={index}
                          className={`text-xs px-3 py-1 rounded-full border ${
                            darkMode
                              ? "bg-slate-800 border-slate-700 text-slate-200"
                              : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-2 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      ⭐
                      <span>{mentor.rating}</span>
                    </div>
                  </td>

                  {/* Active Batches */}
                  <td
                    className={`px-2 py-4 text-center ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {mentor.activeBatches}
                  </td>

                  {/* Status */}
                  <td className="px-2 py-4">
                    <div className="flex justify-center">
                      <MentorStatusBadge
                        isActive={mentor.isActive}
                        onToggle={() => onStatusToggle(mentor.id)}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    className="px-2 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center gap-3 whitespace-nowrap">
                      <MentorActionButtons
                        mentor={mentor}
                        onRemove={handleMentorRemove}
                        onAssign={onMentorAssign}
                        onReplace={onMentorReplace}
                        darkMode={darkMode}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}