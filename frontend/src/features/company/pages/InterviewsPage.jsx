import { useState, useRef, useEffect } from "react";
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

/* ─────────────────────────────────────────────
   Static mock data
───────────────────────────────────────────── */
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
   Actions dropdown cell
───────────────────────────────────────────── */
const ActionsCell = ({ onEdit, onDelete }) => {
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

/* ─────────────────────────────────────────────
   Interviews Table
───────────────────────────────────────────── */
const InterviewsTable = ({ interviews, onDelete }) => (
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

            {/* Actions */}
            <td>
              <ActionsCell
                onEdit={() => alert(`Edit interview for ${row.candidate}`)}
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
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* Filter by search */
  const filtered = interviews.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.candidate.toLowerCase().includes(q) ||
      i.interviewer.toLowerCase().includes(q) ||
      i.round.toLowerCase().includes(q) ||
      i.status.toLowerCase().includes(q)
    );
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
  };

  const handleDelete = (id) => {
    setInterviews((prev) => prev.filter((i) => i.id !== id));
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

          <button className="filter-btn">
            <FiFilter size={14} />
            <span>Status</span>
          </button>

          <button className="filter-btn">
            <FiFilter size={14} />
            <span>Round Type</span>
          </button>
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <InterviewsTable interviews={filtered} onDelete={handleDelete} />
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
            <FiCalendar size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>No interviews found matching your search.</p>
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
    </div>
  );
};

export default InterviewsPage;
