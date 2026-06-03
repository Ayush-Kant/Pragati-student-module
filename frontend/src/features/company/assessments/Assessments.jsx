import { useEffect, useRef, useState } from "react";
import "./Assessments.css";

import { FiSearch, FiFilter } from "react-icons/fi";

const assessmentData = [
  {
    id: 1,
    title: "React Developer Assessment",
    type: "Technical",
    difficulty: "Medium",
    duration: "60 mins",
    candidates: 245,
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    type: "Technical",
    difficulty: "Hard",
    duration: "90 mins",
    candidates: 198,
  },
  {
    id: 3,
    title: "System Design Round",
    type: "Technical",
    difficulty: "Hard",
    duration: "120 mins",
    candidates: 134,
  },
  {
    id: 4,
    title: "Product Aptitude Test",
    type: "Aptitude",
    difficulty: "Medium",
    duration: "45 mins",
    candidates: 167,
  },
  {
    id: 5,
    title: "UI/UX Design Challenge",
    type: "Design",
    difficulty: "Medium",
    duration: "90 mins",
    candidates: 89,
  },
];

const TYPE_FILTERS = ["Technical", "Aptitude", "Design"];
const DIFFICULTY_FILTERS = ["Easy", "Medium", "Hard"];

const AssessmentActionsMenu = ({
  assessment,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleAction = (action) => {
    action(assessment);
    setOpen(false);
  };

  return (
    <div className="assessment-actions-wrap" ref={menuRef}>
      <button
        className="assessment-actions-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
        aria-label={`Actions for ${assessment.title}`}
      >
        ⋮
      </button>

      {open && (
        <div className="assessment-actions-menu">
          <button type="button" onClick={() => handleAction(onView)}>
            View Assessment
          </button>
          <button type="button" onClick={() => handleAction(onEdit)}>
            Edit Assessment
          </button>
          <button type="button" onClick={() => handleAction(onDuplicate)}>
            Duplicate Assessment
          </button>
          <button type="button" onClick={() => handleAction(onDelete)}>
            Delete Assessment
          </button>
        </div>
      )}
    </div>
  );
};

const Assessments = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [assessments, setAssessments] = useState(assessmentData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "Technical",
    difficulty: "Medium",
    duration: "",
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the virtual DOM in React?",
      options: [
        "A cache",
        "A lightweight copy",
        "A database",
        "A component",
      ],
    },
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
      ],
    };

    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id) => {
    setQuestions(
      questions.filter((question) => question.id !== id)
    );
  };

  const filteredAssessments = assessments.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || (
      item.title.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.difficulty.toLowerCase().includes(query)
    );
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesDifficulty = !difficultyFilter || item.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const closeAssessmentDialog = () => {
    setDialogMode(null);
    setSelectedAssessment(null);
  };

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogMode("view");
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setEditForm({
      title: assessment.title,
      type: assessment.type,
      difficulty: assessment.difficulty,
      duration: assessment.duration,
    });
    setDialogMode("edit");
  };

  const handleDuplicateAssessment = (assessment) => {
    setAssessments((currentAssessments) => [
      ...currentAssessments,
      {
        ...assessment,
        id: Date.now(),
        title: `${assessment.title} (Copy)`,
      },
    ]);
  };

  const handleDeleteRequest = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogMode("delete");
  };

  const handleSaveAssessment = (event) => {
    event.preventDefault();

    setAssessments((currentAssessments) =>
      currentAssessments.map((assessment) =>
        assessment.id === selectedAssessment.id
          ? { ...assessment, ...editForm }
          : assessment
      )
    );
    closeAssessmentDialog();
  };

  const handleConfirmDelete = () => {
    setAssessments((currentAssessments) =>
      currentAssessments.filter((assessment) => assessment.id !== selectedAssessment.id)
    );
    closeAssessmentDialog();
  };

  return (
    <div className="assessments-wrapper">

      {/* OVERLAY */}

      {showPanel && (
        <div
          className="assessment-overlay"
          onClick={() => setShowPanel(false)}
        ></div>
      )}

      <div className="assessments-layout">

        {/* LEFT SECTION */}

        <div className="assessments-left">

          <div className="assessments-header">

            <div>
              <h1>Assessments</h1>

              <p>
                Create and manage technical assessments
              </p>
            </div>

            <button
              className="create-btn"
              onClick={() => setShowPanel(true)}
            >
              + Create Test
            </button>

          </div>

          <div className="table-card">

            <div className="filters-row">

  <div className="search-box">

    <FiSearch className="search-icon" />

    <input
      type="text"
      placeholder="Search assessments..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />

  </div>

  <div className="assessment-filter-wrap">
    <button
      className="filter-btn"
      onClick={() => setOpenFilter((current) => current === "type" ? null : "type")}
      type="button"
    >
      <FiFilter />
      Type
    </button>

    {openFilter === "type" && (
      <div className="assessment-filter-dropdown">
        <button
          className={`assessment-filter-option ${!typeFilter ? "active" : ""}`}
          onClick={() => {
            setTypeFilter("");
            setOpenFilter(null);
          }}
          type="button"
        >
          All Types
        </button>
        {TYPE_FILTERS.map((type) => (
          <button
            className={`assessment-filter-option ${typeFilter === type ? "active" : ""}`}
            key={type}
            onClick={() => {
              setTypeFilter(type);
              setOpenFilter(null);
            }}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>
    )}
  </div>

  <div className="assessment-filter-wrap">
    <button
      className="filter-btn"
      onClick={() => setOpenFilter((current) => current === "difficulty" ? null : "difficulty")}
      type="button"
    >
      <FiFilter />
      Difficulty
    </button>

    {openFilter === "difficulty" && (
      <div className="assessment-filter-dropdown">
        <button
          className={`assessment-filter-option ${!difficultyFilter ? "active" : ""}`}
          onClick={() => {
            setDifficultyFilter("");
            setOpenFilter(null);
          }}
          type="button"
        >
          All Difficulties
        </button>
        {DIFFICULTY_FILTERS.map((difficulty) => (
          <button
            className={`assessment-filter-option ${difficultyFilter === difficulty ? "active" : ""}`}
            key={difficulty}
            onClick={() => {
              setDifficultyFilter(difficulty);
              setOpenFilter(null);
            }}
            type="button"
          >
            {difficulty}
          </button>
        ))}
      </div>
    )}
  </div>

</div>

            <div className="table-wrapper">

              <table className="assessment-table">

                <thead>

                  <tr>
                    <th>ASSESSMENT TITLE</th>
                    <th>TYPE</th>
                    <th>DIFFICULTY</th>
                    <th>DURATION</th>
                    <th>CANDIDATES</th>
                    <th>ACTIONS</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredAssessments.length > 0 ? filteredAssessments.map((item) => (

                    <tr key={item.id}>

                      <td>{item.title}</td>

                      <td>
                        <span className="type-badge">
                          {item.type}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`difficulty-badge ${item.difficulty.toLowerCase()}`}
                        >
                          {item.difficulty}
                        </span>
                      </td>

                      <td>{item.duration}</td>

                      <td>{item.candidates}</td>

                      <td>
                        <AssessmentActionsMenu
                          assessment={item}
                          onView={handleViewAssessment}
                          onEdit={handleEditAssessment}
                          onDuplicate={handleDuplicateAssessment}
                          onDelete={handleDeleteRequest}
                        />
                      </td>

                    </tr>

                  )) : (
                    <tr>
                      <td colSpan="6">
                        <div className="assessments-empty-state">
                          No assessments found
                        </div>
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {dialogMode && selectedAssessment && (
          <div
            className="assessment-dialog-overlay"
            onClick={(event) => event.target === event.currentTarget && closeAssessmentDialog()}
          >
            <div className="assessment-dialog" role="dialog" aria-modal="true">
              <div className="assessment-dialog-header">
                <h2>
                  {dialogMode === "view" && "View Assessment"}
                  {dialogMode === "edit" && "Edit Assessment"}
                  {dialogMode === "delete" && "Delete Assessment"}
                </h2>

                <button
                  className="assessment-dialog-close"
                  onClick={closeAssessmentDialog}
                  type="button"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>

              {dialogMode === "view" && (
                <div className="assessment-dialog-body">
                  <div className="assessment-detail-row">
                    <span>Assessment Title</span>
                    <strong>{selectedAssessment.title}</strong>
                  </div>
                  <div className="assessment-detail-row">
                    <span>Type</span>
                    <strong>{selectedAssessment.type}</strong>
                  </div>
                  <div className="assessment-detail-row">
                    <span>Difficulty</span>
                    <strong>{selectedAssessment.difficulty}</strong>
                  </div>
                  <div className="assessment-detail-row">
                    <span>Duration</span>
                    <strong>{selectedAssessment.duration}</strong>
                  </div>
                  <div className="assessment-detail-row">
                    <span>Candidate Count</span>
                    <strong>{selectedAssessment.candidates}</strong>
                  </div>
                </div>
              )}

              {dialogMode === "edit" && (
                <form onSubmit={handleSaveAssessment}>
                  <div className="assessment-dialog-body">
                    <label>
                      Assessment Title
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>

                    <label>
                      Type
                      <select
                        value={editForm.type}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            type: event.target.value,
                          }))
                        }
                      >
                        {TYPE_FILTERS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Difficulty
                      <select
                        value={editForm.difficulty}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            difficulty: event.target.value,
                          }))
                        }
                      >
                        {DIFFICULTY_FILTERS.map((difficulty) => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Duration
                      <input
                        type="text"
                        value={editForm.duration}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            duration: event.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className="assessment-dialog-footer">
                    <button
                      className="assessment-dialog-secondary"
                      onClick={closeAssessmentDialog}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button className="assessment-dialog-primary" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {dialogMode === "delete" && (
                <>
                  <div className="assessment-dialog-body">
                    <p className="assessment-delete-message">
                      Are you sure you want to delete this assessment?
                    </p>
                  </div>

                  <div className="assessment-dialog-footer">
                    <button
                      className="assessment-dialog-secondary"
                      onClick={closeAssessmentDialog}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="assessment-dialog-danger"
                      onClick={handleConfirmDelete}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANEL */}

        {showPanel && (

          <div className="create-panel">

            <div className="panel-header">

              <h2>Create Test</h2>

              <button
                className="close-btn"
                onClick={() => setShowPanel(false)}
              >
                ×
              </button>

            </div>

            <div className="panel-body">

              <label>Test Title</label>

              <input
                type="text"
                placeholder="e.g., React Developer Assessment"
              />

              <div className="double-row">

                <div>

                  <label>Test Type</label>

                  <select>
                    <option>Technical</option>
                    <option>Behavioural</option>
                    <option>Aptitude</option>
                    <option>Design</option>
                  </select>

                </div>

                <div>

                  <label>Difficulty</label>

                  <select>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>

                </div>

              </div>

              <div className="double-row">

                <div>

                  <label>Duration (mins)</label>

                  <input
                    type="number"
                    placeholder="60"
                  />

                </div>

                <div>

                  <label>Passing Score (%)</label>

                  <input
                    type="number"
                    placeholder="70"
                  />

                </div>

              </div>

              <div className="questions-header">

                <label>Questions</label>

                <button
                  className="add-question-btn"
                  onClick={addQuestion}
                >
                  + Add Question
                </button>

              </div>

              {questions.map((question, index) => (

                <div
                  className="question-box"
                  key={question.id}
                >

                  <div className="question-top">

                    <p>Question {index + 1}</p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteQuestion(question.id)
                      }
                    >
                      🗑
                    </button>

                  </div>

                  <input
                    type="text"
                    value={question.question}
                    placeholder="Enter your question..."
                    readOnly
                  />

                  <div className="options-grid">

                    {question.options.map(
                      (option, optionIndex) => (

                        <label key={optionIndex}>

                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            defaultChecked={
                              optionIndex === 1
                            }
                          />

                          {option}

                        </label>

                      )
                    )}

                  </div>

                </div>

              ))}

            </div>

            <div className="panel-footer">

              <button className="draft-btn">
                Save Draft
              </button>

              <button
                className="publish-btn"
                onClick={() => setShowPanel(false)}
              >
                Publish Test
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Assessments;
