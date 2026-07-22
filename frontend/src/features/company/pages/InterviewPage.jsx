import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiClock,
  FiVideo,
  FiX,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import "./../styles/interviews.css";
import { useCompanyInterviews } from "../hooks/useCompanyInterviews";
import { useCandidates } from "../candidates/hooks/useCandidates";

const ROUND_TYPES = [
  "Technical Round 1",
  "Technical Round 2",
  "HR Round",
  "Managerial Round",
];

const STATUS_FILTERS = ["Scheduled", "Completed", "No Show"];
const RESULT_OPTIONS = ["Pass", "Fail"];

/* ─────────────────────────────────────────────
   Schedule Interview Modal
───────────────────────────────────────────── */
const ScheduleModal = ({ onClose, onSubmit, candidatesList }) => {
  const [form, setForm] = useState({
    candidate: "",
    interviewer: "Priya Sharma",
    date: "",
    time: "",
    roundType: "Technical Round 1",
    meetingLink: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.candidate) {
      toast.error("Please select a candidate");
      return;
    }
    onSubmit(form);
    onClose();
  };

  /* Close on ESC */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title">Schedule Interview</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Candidate */}
            <div className="form-group">
              <label htmlFor="candidate">Candidate</label>
              <div className="select-wrap">
                <FiUser size={16} className="select-icon" />
                <select
                  id="candidate"
                  name="candidate"
                  className="form-control"
                  value={form.candidate}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a candidate…</option>
                  {candidatesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.college || 'College'} ({c.status || 'Active'})
                    </option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
            </div>

            {/* Interviewer */}
            <div className="form-group">
              <label htmlFor="interviewer">Interviewer</label>
              <input
                id="interviewer"
                name="interviewer"
                className="form-control"
                value={form.interviewer}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                required
              />
            </div>

            {/* Date + Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <div className="input-wrap">
                  <FiCalendar size={16} className="input-icon" />
                  <input
                    id="date"
                    type="date"
                    name="date"
                    className="form-control"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="time">Time</label>
                <div className="input-wrap">
                  <FiClock size={16} className="input-icon" />
                  <input
                    id="time"
                    type="time"
                    name="time"
                    className="form-control"
                    value={form.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Round Type */}
            <div className="form-group">
              <label htmlFor="roundType">Round Type</label>
              <div className="select-wrap">
                <select
                  id="roundType"
                  name="roundType"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  value={form.roundType}
                  onChange={handleChange}
                >
                  {ROUND_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
            </div>

            {/* Meeting Link */}
            <div className="form-group">
              <label htmlFor="meetingLink">Meeting Link (Optional)</label>
              <div className="input-wrap">
                <FiVideo size={16} className="input-icon" />
                <input
                  id="meetingLink"
                  type="url"
                  name="meetingLink"
                  className="form-control"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={form.meetingLink}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control textarea"
                rows={3}
                placeholder="Topics to cover or additional details"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Edit Interview Modal
───────────────────────────────────────────── */
const EditInterviewModal = ({ interview, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: interview.date || "",
    time: interview.time || "",
    round: interview.round || "Technical Round 1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="modal-header">
          <h2 id="edit-modal-title">Edit Interview</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Candidate</label>
              <input className="form-control" value={interview.candidate} disabled />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-date">Date</label>
                <input
                  id="edit-date"
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-time">Time</label>
                <input
                  id="edit-time"
                  type="time"
                  name="time"
                  className="form-control"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-round">Round</label>
              <div className="select-wrap">
                <select
                  id="edit-round"
                  name="round"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  value={form.round}
                  onChange={handleChange}
                >
                  {ROUND_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Feedback & Result Modal
───────────────────────────────────────────── */
const FeedbackModal = ({ interview, onClose, onSave }) => {
  const [form, setForm] = useState({
    result: interview.result || RESULT_OPTIONS[0],
    rating: 4,
    strengths: "",
    improvements: "",
    comments: "",
    attendance: "present"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title">
        <div className="modal-header">
          <h2 id="feedback-modal-title">Interview Feedback & Result</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Candidate</label>
              <input className="form-control" value={interview.candidate} disabled />
            </div>
            <div className="form-group">
              <label>Interviewer</label>
              <input className="form-control" value={interview.interviewer} disabled />
            </div>
            <div className="form-group">
              <label>Round</label>
              <input className="form-control" value={interview.round} disabled />
            </div>

            <div className="form-group">
              <label>Attendance</label>
              <select
                name="attendance"
                className="form-control"
                value={form.attendance}
                onChange={handleChange}
              >
                <option value="present">Present</option>
                <option value="absent">Absent / No Show</option>
              </select>
            </div>

            <div className="form-group">
              <label>Result Decision</label>
              <div className="feedback-chips">
                {RESULT_OPTIONS.map((option) => (
                  <label key={option} className={`feedback-chip ${form.result === option ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="result"
                      value={option}
                      checked={form.result === option}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <div className="select-wrap">
                <select
                  id="rating"
                  name="rating"
                  className="form-control"
                  style={{ paddingLeft: "14px" }}
                  value={form.rating}
                  onChange={handleChange}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} / 5</option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="strengths">Strengths</label>
              <textarea
                id="strengths"
                name="strengths"
                className="form-control textarea"
                rows={2}
                placeholder="Key strengths observed during the interview"
                value={form.strengths}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="improvements">Areas for Improvement</label>
              <textarea
                id="improvements"
                name="improvements"
                className="form-control textarea"
                rows={2}
                placeholder="Areas the candidate should improve"
                value={form.improvements}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comments">Additional Comments</label>
              <textarea
                id="comments"
                name="comments"
                className="form-control textarea"
                rows={3}
                placeholder="Additional feedback or candidate recommendation"
                value={form.comments}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Submit Results</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 
   Actions dropdown cell
 */
const ActionsCell = ({ onEdit, onDelete, onFeedback }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button className="action-btn" onClick={() => setOpen((o) => !o)} aria-label="More actions">
        <FiMoreVertical size={18} />
      </button>
      {open && (
        <div className="action-dropdown">
          <button onClick={() => { onFeedback(); setOpen(false); }}>
            <FiUser size={14} /> Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};

/* 
   Interviews Table
 */
const InterviewsTable = ({ interviews, onEdit, onDelete, onFeedback }) => (
  <div className="interviews-table-wrap">
    <table className="interviews-table">
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Interviewer</th>
          <th>Date</th>
          <th>Time</th>
          <th>Round</th>
          <th>Status</th>
          <th>Result</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {interviews.map((row) => (
          <tr key={row.id}>
            {/* Candidate */}
            <td>
              <div className="candidate-cell">
                <div className={`avatar ${row.avatarClass}`}>{row.initials}</div>
                <span className="candidate-name">{row.candidate}</span>
              </div>
            </td>

            {/* Interviewer */}
            <td>{row.interviewer}</td>

            {/* Date */}
            <td>
              <div className="date-cell">
                <FiCalendar size={14} />
                {row.date}
              </div>
            </td>

            {/* Time */}
            <td>
              <div className="time-cell">
                <FiClock size={14} />
                {row.time}
              </div>
            </td>

            {/* Round */}
            <td>
              <span className={`round-badge ${row.roundType}`}>{row.round}</span>
            </td>

            {/* Status */}
            <td>
              <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                {row.status}
              </span>
            </td>

            {/* Result */}
            <td>
              <span className={`result-badge ${row.result ? row.result.toLowerCase() : "pending"}`}>
                {row.result || "Pending"}
              </span>
            </td>

            {/* Actions */}
            <td>
              <ActionsCell
                onEdit={() => onEdit(row)}
                onFeedback={() => onFeedback(row)}
                onDelete={() => onDelete(row.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─────────────────────────────────────────────
   Main Interviews Page
───────────────────────────────────────────── */
const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldOpenScheduleInterview = Boolean(location.state?.openScheduleInterview);

  const {
    interviews,
    loading: loadingInterviews,
    error: errorInterviews,
    scheduleInterview,
    submitFeedback,
    updateResult
  } = useCompanyInterviews();

  const {
    candidates: candidatesList,
    loading: loadingCandidates
  } = useCandidates();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [showModal, setShowModal] = useState(shouldOpenScheduleInterview);
  const [editingInterview, setEditingInterview] = useState(null);
  const [feedbackInterview, setFeedbackInterview] = useState(null);

  const handleOpenFeedback = (interview) => {
    setFeedbackInterview(interview);
  };

  const handleSaveFeedback = async (feedback) => {
    try {
      // 1. Submit feedback comments text
      const commentsText = `Strengths: ${feedback.strengths || "N/A"}. Improvements: ${feedback.improvements || "N/A"}. Notes: ${feedback.comments || "N/A"}. Rating: ${feedback.rating}/5.`;
      await submitFeedback(feedbackInterview.id, commentsText);

      // 2. Mark pass/fail result
      const uppercaseResult = feedback.result === "Pass" ? "PASS" : "FAIL";
      await updateResult(feedbackInterview.id, uppercaseResult, feedback.attendance);

      toast.success("Interview feedback and results updated successfully");
      setFeedbackInterview(null);
    } catch (err) {
      toast.error("Failed to save feedback");
    }
  };

  useEffect(() => {
    if (shouldOpenScheduleInterview) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, shouldOpenScheduleInterview]);

  /* Filter by search, status, and round type */
  const filtered = interviews.filter((i) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || (
      i.candidate.toLowerCase().includes(q) ||
      i.interviewer.toLowerCase().includes(q) ||
      i.round.toLowerCase().includes(q) ||
      i.status.toLowerCase().includes(q)
    );

    const matchesStatus = !statusFilter || i.status === statusFilter;
    const matchesRound = !roundFilter || i.round === roundFilter;

    return matchesSearch && matchesStatus && matchesRound;
  });

  const handleSchedule = async (form) => {
    try {
      await scheduleInterview({
        candidateId: parseInt(form.candidate, 10),
        round: form.roundType,
        date: form.date,
        time: form.time,
        meetingLink: form.meetingLink,
        notes: form.notes
      });
      toast.success("Interview scheduled successfully");
    } catch (err) {
      toast.error("Failed to schedule interview");
    }
  };

  const handleDelete = () => {
    // Disabled in actual backend as there is no DELETE route specified
    toast.error("Interview deletion is not supported");
  };

  const handleEdit = () => {
    toast.error("Interview edit is not supported");
  };

  const handleSaveEdit = () => {
    setEditingInterview(null);
  };

  if (loadingInterviews) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin inline-block"></div>
          <p className="text-gray-600 mt-4 font-semibold">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interviews-page">
      {errorInterviews && (
        <div className="mx-8 my-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">
          {errorInterviews}
        </div>
      )}

      {/* Page Header */}
      <div className="interviews-header">
        <div className="interviews-header-text">
          <h1>Interviews</h1>
          <p>Schedule and manage candidate interviews</p>
        </div>

        <button
          className="btn-schedule"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={16} />
          Schedule Interview
        </button>
      </div>

      {/* Card */}
      <div className="interviews-card">
        {/* Toolbar */}
        <div className="interviews-toolbar">
          <div className="interviews-search-wrap">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search interviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="interviews-filter-wrap">
            <button
              className="filter-btn"
              onClick={() => setOpenFilter((current) => current === "status" ? null : "status")}
              type="button"
            >
              <FiFilter size={14} />
              <span>Status</span>
            </button>

            {openFilter === "status" && (
              <div className="interviews-filter-dropdown">
                <button
                  className={`interviews-filter-option ${!statusFilter ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter("");
                    setOpenFilter(null);
                  }}
                  type="button"
                >
                  All Statuses
                </button>
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    className={`interviews-filter-option ${statusFilter === status ? "active" : ""}`}
                    onClick={() => {
                      setStatusFilter(status);
                      setOpenFilter(null);
                    }}
                    type="button"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="interviews-filter-wrap">
            <button
              className="filter-btn"
              onClick={() => setOpenFilter((current) => current === "round" ? null : "round")}
              type="button"
            >
              <FiFilter size={14} />
              <span>Round Type</span>
            </button>

            {openFilter === "round" && (
              <div className="interviews-filter-dropdown round-filter-dropdown">
                <button
                  className={`interviews-filter-option ${!roundFilter ? "active" : ""}`}
                  onClick={() => {
                    setRoundFilter("");
                    setOpenFilter(null);
                  }}
                  type="button"
                >
                  All Rounds
                </button>
                {ROUND_TYPES.map((round) => (
                  <button
                    key={round}
                    className={`interviews-filter-option ${roundFilter === round ? "active" : ""}`}
                    onClick={() => {
                      setRoundFilter(round);
                      setOpenFilter(null);
                    }}
                    type="button"
                  >
                    {round}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <InterviewsTable
            interviews={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFeedback={handleOpenFeedback}
          />
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
            <FiCalendar size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>No interviews scheduled</p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <ScheduleModal
          candidatesList={candidatesList}
          onClose={() => setShowModal(false)}
          onSubmit={handleSchedule}
        />
      )}

      {/* Edit Interview Modal */}
      {editingInterview && (
        <EditInterviewModal
          interview={editingInterview}
          onClose={() => setEditingInterview(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Feedback Modal */}
      {feedbackInterview && (
        <FeedbackModal
          interview={feedbackInterview}
          onClose={() => setFeedbackInterview(null)}
          onSave={handleSaveFeedback}
        />
      )}
    </div>
  );
};

export default InterviewPage;
