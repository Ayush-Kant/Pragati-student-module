import CollegeStatusBadge from "./CollegeStatusBadge";
import CollegeActionButtons from "./CollegeActionButtons";
import { useNavigate } from "react-router-dom";

export default function CollegeTable({ colleges }) {
  const navigate = useNavigate();
  return (
    <div className=" rounded-lg shadow mt-6 overflow-x-auto">
      <table className="w-full">
        <thead className="">
          <tr>
            <th className="p-3 text-left">College</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Departments</th>
            <th className="p-3 text-left">Students</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges?.map((college) => (
            <tr
              key={college.collegeId}
              className="border-b"
            >
              <td className="py-5 px-4">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/colleges/${college.collegeId}`
                    )
                  }
                  className=" font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  {college.name}
                </button>
              </td>
              <td className="p-3">
                {college.location}
              </td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  {college.departments
                    .slice(0, 3)
                    .map((dept, index) => (
                      <span
                        key={index}
                        className="px-2 py-1  rounded"
                      >
                        {dept}
                      </span>
                    ))}
                  {
                    college.departments.length > 3 && (
                      <span>
                        +{college.departments.length - 3} more
                      </span>
                    )
                  }
                </div>
              </td>
              <td className="p-3">
                {college.studentStrength}
              </td>
              <td className="p-3">
                <CollegeStatusBadge
                  status={college.status}
                />
              </td>
              <td className="p-3">
                <CollegeActionButtons
                  status={college.status}
                  collegeName={college.name}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}