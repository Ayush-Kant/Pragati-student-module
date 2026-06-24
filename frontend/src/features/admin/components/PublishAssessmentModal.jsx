import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as adminService from "../services/adminService";

function PublishAssessmentModal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      await adminService.publishAssessment(id);

      toast.success(
        "Assessment published successfully"
      );

      navigate(`/admin/assessments/${id}`);
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to publish assessment"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">
          Publish Assessment
        </h1>

        <p className="mb-6 text-gray-600">
          Are you sure you want to publish this
          assessment?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(
                `/admin/assessments/${id}`
              )
            }
            className="border rounded-lg px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handlePublish}
            className="bg-green-600 text-white rounded-lg px-4 py-2"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishAssessmentModal;