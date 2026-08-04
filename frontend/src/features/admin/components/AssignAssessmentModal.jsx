import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as adminService from "../services/adminService";

function AssignAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      const response =
        await adminService.getDrives();

      setDrives(response || []);
    } catch (error) {
      toast.error(
        "Failed to load drives"
      );
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedDrive) {
      toast.error(
        "Please select a drive"
      );
      return;
    }

    try {
      setLoading(true);

      await adminService.assignAssessment(
        id,
        {
          driveId: selectedDrive,
        }
      );

      toast.success(
        "Assessment assigned successfully"
      );

      navigate(
        `/admin/assessments/${id}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to assign assessment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <div className="rounded-lg bg-white p-4 shadow md:p-6">
        <h1 className="mb-6 text-xl font-bold md:text-2xl">
          Assign Assessment
        </h1>

        <form onSubmit={handleAssign}>
          <label className="mb-2 block text-sm font-medium md:text-base">
            Recruitment Drive
          </label>

          <select
            value={selectedDrive}
            onChange={(e) =>
              setSelectedDrive(
                e.target.value
              )
            }
            className="mb-6 w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          >
            <option value="">
              Select Drive
            </option>

            {drives.map((drive) => (
              <option
                key={drive.id}
                value={drive.id}
              >
                {drive.title}
              </option>
            ))}
          </select>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="px-3 py-2 text-sm md:px-4 md:text-base border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-purple-600 text-white rounded"
            >
              {loading
                ? "Assigning..."
                : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignAssessment;