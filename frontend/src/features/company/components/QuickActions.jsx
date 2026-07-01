import "./../styles/quickActions.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { candidateService } from "../candidates/services/candidateService";

const actions = [
  {
    label: "Create Drive",
    className: "blue-btn",
  },
  {
    label: "Schedule Interview",
    className: "green-btn",
  },
  {
    label: "Send Notification",
    className: "orange-btn",
  },
  {
    label: "Export Candidates",
    className: "purple-btn",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    audience: "All Candidates",
  });

  const handleNotificationChange = (event) => {
    const { name, value } = event.target;
    setNotificationForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateDrive = () => {
    navigate("/company/drives", { state: { openCreateDrive: true } });
  };

  const handleScheduleInterview = () => {
    navigate("/company/interviews", { state: { openScheduleInterview: true } });
  };

  const handleSendNotification = (event) => {
    event.preventDefault();
    setShowNotificationModal(false);
    setNotificationForm({
      title: "",
      message: "",
      audience: "All Candidates",
    });
    toast.success("Notification sent successfully");
  };

  const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const handleExportCandidates = async () => {
    try {
      const candidates = await candidateService.getAllCandidates();
      const headers = ["Name", "College", "Role", "Score", "Status", "Email", "Phone"];
      const rows = candidates.map((candidate) => [
        candidate.name,
        candidate.college,
        candidate.role,
        candidate.score,
        candidate.status,
        candidate.email,
        candidate.phone,
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "candidates.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Candidates exported successfully");
    } catch (error) {
      console.error("Error exporting candidates:", error);
      toast.error("Failed to export candidates");
    }
  };

  const actionHandlers = {
    "Create Drive": handleCreateDrive,
    "Schedule Interview": handleScheduleInterview,
    "Send Notification": () => setShowNotificationModal(true),
    "Export Candidates": handleExportCandidates,
  };

  return (
    <>
      <div className="quick-actions-card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-actions-list">
          {actions.map((action, index) => (
            <button
              key={index}
              className={action.className}
              onClick={actionHandlers[action.label]}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {showNotificationModal && (
        <div
          className="quick-action-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowNotificationModal(false);
            }
          }}
        >
          <form className="quick-action-modal" onSubmit={handleSendNotification}>
            <div className="quick-action-modal-header">
              <h3>Send Notification</h3>
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                aria-label="Close notification modal"
              >
                x
              </button>
            </div>

            <div className="quick-action-modal-body">
              <label>
                Title
                <input
                  name="title"
                  type="text"
                  value={notificationForm.title}
                  onChange={handleNotificationChange}
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  value={notificationForm.message}
                  onChange={handleNotificationChange}
                  required
                />
              </label>

              <label>
                Target Audience
                <select
                  name="audience"
                  value={notificationForm.audience}
                  onChange={handleNotificationChange}
                >
                  <option>All Candidates</option>
                  <option>Shortlisted Candidates</option>
                  <option>Interview Candidates</option>
                  <option>Assessment Candidates</option>
                </select>
              </label>
            </div>

            <div className="quick-action-modal-footer">
              <button
                className="quick-action-cancel"
                type="button"
                onClick={() => setShowNotificationModal(false)}
              >
                Cancel
              </button>
              <button className="quick-action-send" type="submit">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default QuickActions;
