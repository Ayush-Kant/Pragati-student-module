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

/* 
   Static mock data
*/
const MOCK_INTERVIEWS = [
  {
    id: 1,
    candidate: "Rahul Patil",
    initials: "RP",
    avatarClass: "avatar-rp",
    interviewer: "Priya Sharma",
    date: "May 15, 2026",
    time: "10:00 AM",
    round: "Technical Round 1",
    roundType: "technical",
    status: "Scheduled",
  },
  {
    id: 2,
    candidate: "Sneha Reddy",
    initials: "SR",
    avatarClass: "avatar-sr",
    interviewer: "Vikram Singh",
    date: "May 15, 2026",
    time: "02:00 PM",
    round: "Technical Round 2",
    roundType: "technical",
    status: "Scheduled",
  },
  {
    id: 3,
    candidate: "Amit Kumar",
    initials: "AK",
    avatarClass: "avatar-ak",
    interviewer: "Anjali Desai",
    date: "May 16, 2026",
    time: "11:00 AM",
    round: "HR Round",
    roundType: "hr",
    status: "Scheduled",
  },
  {
    id: 4,
    candidate: "Priya Sharma",
    initials: "PS",
    avatarClass: "avatar-ps",
    interviewer: "Meera Iyer",
    date: "May 16, 2026",
    time: "03:30 PM",
    round: "Technical Round 1",
    roundType: "technical",
    status: "Completed",
  },
  {
    id: 5,
    candidate: "Ravi Patel",
    initials: "RP",
    avatarClass: "avatar-rv",
    interviewer: "Priya Sharma",
    date: "May 17, 2026",
    time: "09:00 AM",
    round: "Final Round",
    roundType: "final",
    status: "Scheduled",
  },
];

const CANDIDATES = [
  "Rahul Patil - Software Engineer",
  "Sneha Reddy - Data Analyst",
  "Amit Kumar - Backend Developer",
  "Priya Sharma - Product Manager",
  "Ravi Patel - DevOps Engineer",
];

const INTERVIEWERS = [
  "Priya Sharma - Tech Lead",
  "Vikram Singh - Engineering Manager",
  "Anjali Desai - HR Manager",
  "Meera Iyer - Senior Engineer",
];

const ROUND_TYPES = [
  "Technical Round 1",
  "Technical Round 2",
  "HR Round",
  "Final Round",
];

const STATUS_FILTERS = ["Scheduled", "Completed"];
const RESULT_OPTIONS = ["Pass", "Fail"];

/* ─────────────────────────────────────────────
   Schedule Interview Modal
───────────────────────────────────────────── */
const ScheduleModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    candidate: "",
    interviewer: "",
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
                  <option value="" disabled>Select a candidate…</option>
                  {CANDIDATES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
            </div>

            {/* Interviewer */}
            <div className="form-group">
              <label htmlFor="interviewer">Interviewer</label>
              <div className="select-wrap">
                <FiUser size={16} className="select-icon" />
                <select
                  id="interviewer"
                  name="interviewer"
                  className="form-control"
                  value={form.interviewer}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select an interviewer…</option>
                  {INTERVIEWERS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
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
              <label htmlFor="meetingLink">Meeting Link</label>
              <div className="input-wrap">
                <FiVideo size={16} className="input-icon" />
                <input
                  id="meetingLink"
                  type="url"
                  name="meetingLink"
                  className="form-control"
                  placeholder="https://meet.google.com/..."
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
                placeholder="Add any special instructions or notes..."
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Schedule Interview
            </button>
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
  // Convert display date ("May 15, 2026") → YYYY-MM-DD for the date input
  const toInputDate = (displayDate) => {
    try {
      const d = new Date(displayDate + " 00:00:00");
      if (isNaN(d)) return "";
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  // Convert display time ("10:00 AM") → HH:MM for the time input
  const toInputTime = (displayTime) => {
    try {
      const [timePart, meridiem] = displayTime.split(" ");
      let [h, m] = timePart.split(":").map(Number);
      if (meridiem === "PM" && h !== 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const [form, setForm] = useState({
    candidate: interview.candidate || "",
    interviewer: interview.interviewer || "",
    date: toInputDate(interview.date),
    time: toInputTime(interview.time),
    roundType: interview.round || ROUND_TYPES[0],
    status: interview.status || "Scheduled",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.candidate.trim()) errs.candidate = "Candidate name is required";
    if (!form.interviewer.trim()) errs.interviewer = "Interviewer is required";
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Time is required";
    if (!form.roundType) errs.roundType = "Round type is required";
    if (!form.status) errs.status = "Status is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const dateObj = new Date(form.date + "T00:00:00");
    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const [h, m] = form.time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    const timeStr = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;

    const roundTypeMap = {
      "Technical Round 1": "technical",
      "Technical Round 2": "technical",
      "HR Round": "hr",
      "Final Round": "final",
    };

    onSave({
      candidate: form.candidate.trim(),
      interviewer: form.interviewer.trim(),
      date: dateStr,
      time: timeStr,
      round: form.roundType,
      roundType: roundTypeMap[form.roundType] || "technical",
      status: form.status,
    });
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
              <label htmlFor="edit-candidate">Candidate Name</label>
              <div className="input-wrap">
                <FiUser size={16} className="input-icon" />
                <input id="edit-candidate" type="text" name="candidate" className="form-control" value={form.candidate} onChange={handleChange} placeholder="e.g. Rahul Patil" />
              </div>
              {errors.candidate && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.candidate}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-interviewer">Interviewer</label>
              <div className="input-wrap">
                <FiUser size={16} className="input-icon" />
                <input id="edit-interviewer" type="text" name="interviewer" className="form-control" value={form.interviewer} onChange={handleChange} placeholder="e.g. Priya Sharma" />
              </div>
              {errors.interviewer && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.interviewer}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-date">Date</label>
                <div className="input-wrap">
                  <FiCalendar size={16} className="input-icon" />
                  <input id="edit-date" type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
                </div>
                {errors.date && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.date}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="edit-time">Time</label>
                <div className="input-wrap">
                  <FiClock size={16} className="input-icon" />
                  <input id="edit-time" type="time" name="time" className="form-control" value={form.time} onChange={handleChange} />
                </div>
                {errors.time && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.time}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-roundType">Round Type</label>
              <div className="select-wrap">
                <select id="edit-roundType" name="roundType" className="form-control" style={{ paddingLeft: "14px" }} value={form.roundType} onChange={handleChange}>
                  {ROUND_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
              {errors.roundType && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.roundType}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <div className="select-wrap">
                <select id="edit-status" name="status" className="form-control" style={{ paddingLeft: "14px" }} value={form.status} onChange={handleChange}>
                  {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <FiChevronDown size={16} className="chevron-icon" />
              </div>
              {errors.status && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.status}</p>}
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

/* 
   Feedback Modal
 */
const FeedbackModal = ({ interview, onClose, onSave }) => {
  const [form, setForm] = useState({
    result: interview.result || RESULT_OPTIONS[0],
    rating: interview.rating || 4,
    strengths: interview.feedback?.strengths || "",
    improvements: interview.feedback?.improvements || "",
    comments: interview.feedback?.comments || "",
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
          <h2 id="feedback-modal-title">Interview Feedback</h2>
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
              <label>Result</label>
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
                rows={3}
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
                rows={3}
                placeholder="Areas the candidate should improve"
                value={form.improvements}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                className="form-control textarea"
                rows={4}
                placeholder="Additional feedback or candidate recommendation"
                value={form.comments}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Save Feedback</button>
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
          <button onClick={() => { onEdit(); setOpen(false); }}>
            <FiEdit2 size={14} /> Edit
          </button>
          <button onClick={() => { onFeedback(); setOpen(false); }}>
            <FiUser size={14} /> Feedback
          </button>
          <button
            className="danger"
            onClick={() => { onDelete(); setOpen(false); }}
          >
            <FiTrash2 size={14} /> Delete
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
              <span className={`status-badge ${row.status.toLowerCase()}`}>
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
const InterviewsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldOpenScheduleInterview = Boolean(location.state?.openScheduleInterview);
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
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

  const handleSaveFeedback = (feedback) => {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === feedbackInterview.id
          ? {
              ...i,
              result: feedback.result,
              rating: feedback.rating,
              feedback: {
                strengths: feedback.strengths,
                improvements: feedback.improvements,
                comments: feedback.comments,
              },
              status: i.status === "Scheduled" ? "Completed" : i.status,
            }
          : i
      )
    );
    toast.success("Interview feedback saved");
    setFeedbackInterview(null);
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

  /* Add new interview from modal */
  const handleSchedule = (form) => {
    const namePart = form.candidate.split(" - ")[0] || form.candidate;
    const initials = namePart
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const roundTypeMap = {
      "Technical Round 1": "technical",
      "Technical Round 2": "technical",
      "HR Round": "hr",
      "Final Round": "final",
    };

    const dateObj = form.date ? new Date(form.date + "T00:00:00") : new Date();
    const dateStr = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const [h, m] = (form.time || "00:00").split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const timeStr = `${hour12}:${m} ${ampm}`;

    setInterviews((prev) => [
      ...prev,
      {
        id: Date.now(),
        candidate: namePart,
        initials,
        avatarClass: "avatar-default",
        interviewer: form.interviewer.split(" - ")[0] || form.interviewer,
        date: dateStr,
        time: timeStr,
        round: form.roundType,
        roundType: roundTypeMap[form.roundType] || "technical",
        status: "Scheduled",
      },
    ]);
    toast.success("Interview scheduled successfully");
  };

  const handleDelete = (id) => {
    setInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
  };

  const handleSaveEdit = (updatedFields) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === editingInterview.id ? { ...i, ...updatedFields } : i))
    );
    toast.success("Interview updated successfully");
    setEditingInterview(null);
  };

  return (
    <div className="interviews-page">
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
          <InterviewsTable interviews={filtered} onEdit={handleEdit} onDelete={handleDelete} onFeedback={handleOpenFeedback} />
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
            <FiCalendar size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>No interviews found</p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <ScheduleModal
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

export default InterviewsPage;
