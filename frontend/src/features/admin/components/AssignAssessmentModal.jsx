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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Assign Assessment
        </h1>

        <form onSubmit={handleAssign}>
          <label className="block mb-2">
            Recruitment Drive
          </label>

          <select
            value={selectedDrive}
            onChange={(e) =>
              setSelectedDrive(
                e.target.value
              )
            }
            className="w-full border rounded p-2 mb-6"
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded"
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