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


  const [testTitle, setTestTitle] =
    useState("");

  const [testType, setTestType] =
    useState("Technical");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [duration, setDuration] =
    useState("");

  const [passingScore, setPassingScore] =
    useState("");
const [searchTerm, setSearchTerm] =
useState("");
const [selectedType, setSelectedType] =
  useState("All");
  const [selectedDifficulty, setSelectedDifficulty] =
  useState("All");
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
    }
    ,
  ]);

  const addQuestion = () => {
  console.log("Add Question Clicked");

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

  setQuestions((prevQuestions) => [
    ...prevQuestions,
    newQuestion,
  ]);
};

    
  const deleteQuestion = (id) => {
    setQuestions(
      questions.filter(
        (question) => question.id !== id
      )
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

  const publishAssessment = () => {
    if (!testTitle.trim()) return;

    const newAssessment = {
      id: Date.now(),
      title: testTitle,
      type: testType,
      difficulty,
      duration: `${duration || 0} mins`,
      candidates: 0,
    };

    setAssessments([
      ...assessments,
      newAssessment,
    ]);

    setShowPanel(false);

    setTestTitle("");
    setTestType("Technical");
    setDifficulty("Medium");
    setDuration("");
    setPassingScore("");
  };

  return (<div className="assessments-wrapper">

      {showPanel && (
        <div
          className="assessment-overlay"
          onClick={() => setShowPanel(false)}
        ></div>
      )}

      <div className="assessments-layout">

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
  onChange={(e) => setSearch(e.target.value)}
/>

              </div>

  <select
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
  className="filter-btn"
>
  <option value="">All Types</option>
  {TYPE_FILTERS.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</select>

  <select
  value={difficultyFilter}
  onChange={(e) => setDifficultyFilter(e.target.value)}
  className="filter-btn"
>
  <option value="">All Difficulty</option>
  {DIFFICULTY_FILTERS.map((difficulty) => (
    <option key={difficulty} value={difficulty}>
      {difficulty}
    </option>
  ))}
</select>

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

                  {filteredAssessments.length > 0 ? (
  filteredAssessments.map((item) => (

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

                  )) 
                ) : (
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
                value={testTitle}
                onChange={(e) =>
                  setTestTitle(e.target.value)
                }
                placeholder="e.g., React Developer Assessment"
              />

              <div className="double-row">

                <div>

                  <label>Test Type</label>

                  <select
                    value={testType}
                    onChange={(e) =>
                      setTestType(e.target.value)
                    }
                  >
                    <option>Technical</option>
                    <option>Behavioural</option>
                    <option>Aptitude</option>
                    <option>Design</option>
                  </select>

                </div>

                <div>

                  <label>Difficulty</label>

                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value)
                    }
                  >
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
                    value={duration}
                    onChange={(e) =>
                      setDuration(e.target.value)
                    }
                    placeholder="60"
                  />

                </div>

                <div>

                  <label>Passing Score (%)</label>

                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) =>
                      setPassingScore(e.target.value)
                    }
                    placeholder="70"
                  />

                </div>

              </div>

              <div className="questions-header">

                <label>Questions</label>

               <button
  type="button"
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

                    <p>
                      Question {index + 1}
                    </p>

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
                    onChange={(e) => {
                      const updatedQuestions = [...questions];

                      updatedQuestions[index].question =
                        e.target.value;

                      setQuestions(updatedQuestions);
                    }}
                  />

                  <div className="options-grid">

                    {question.options.map(
                      (option, optionIndex) => (

                        <label key={optionIndex}>
  <input
    type="radio"
    name={`question-${question.id}`}
    defaultChecked={optionIndex === 1}
  />

  <input
    type="text"
    value={option}
    onChange={(e) => {
      const updatedQuestions = [...questions];

      updatedQuestions[index].options[
        optionIndex
      ] = e.target.value;

      setQuestions(updatedQuestions);
    }}
    placeholder={`Option ${optionIndex + 1}`}
  />
</label>

                      )
                    )}

                  </div>

                </div>

              ))}
              </div>

            <div className="assign-drive-box">

              <h3>
                Assign Assessment To Drive
              </h3>

              <select>
                <option>
                  Select Drive
                </option>

                <option>
                  React Hiring Drive
                </option>

                <option>
                  Frontend Hiring Drive
                </option>

                <option>
                  Campus Recruitment Drive
                </option>
              </select>

              <button className="assign-btn">
                Assign Assessment
              </button>

            </div>

            <div className="panel-footer">

              <button className="draft-btn">
                Save Draft
              </button>

              <button
                className="publish-btn"
                onClick={publishAssessment}
              >
                Publish Test
              </button>

            </div>

          </div>

        )}
{/* VIEW MODAL */}
{dialogMode === "view" && selectedAssessment && (
  <div className="assessment-modal">
    <div className="assessment-modal-content">
      <h2 className="modal-title"> {selectedAssessment.title}</h2>

      <p><strong>Type:</strong> {selectedAssessment.type}</p>
      <p><strong>Difficulty:</strong> {selectedAssessment.difficulty}</p>
      <p><strong>Duration:</strong> {selectedAssessment.duration}</p>
      <p><strong>Candidates:</strong> {selectedAssessment.candidates}</p>

      <button 
      className="cancel-btn" 
      onClick={closeAssessmentDialog}>
        Close
      </button>
    </div>
  </div>
)}

{/* EDIT MODAL */}
{dialogMode === "edit" && selectedAssessment && (
  <div className="assessment-modal">
    <div className="assessment-modal-content">
      <h2 className="edit-title"> Edit Assessment </h2>

      <form onSubmit={handleSaveAssessment}>
        <input
          type="text"
          value={editForm.title}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              title: e.target.value,
            })
          }
        />

        <select
          value={editForm.type}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              type: e.target.value,
            })
          }
        >
          <option>Technical</option>
          <option>Aptitude</option>
          <option>Design</option>
        </select>

        <select
          value={editForm.difficulty}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              difficulty: e.target.value,
            })
          }
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input
          type="text"
          value={editForm.duration}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              duration: e.target.value,
            })
          }
        />

        <button
        className="save-btn"
        type="submit"
        >
          Save Changes
        </button>

        <button
        className="cancel-btn"
          type="button"
          onClick={closeAssessmentDialog}
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

{/* DELETE MODAL */}
{dialogMode === "delete" && selectedAssessment && (
  <div className="assessment-modal">
    <div className="assessment-modal-content delete-modal">

  <h2 className="delete-title">
    Delete Assessment
  </h2>

  <h3 className="delete-assessment-name">
    {selectedAssessment.title}
  </h3>

  <p className="delete-text">
    Are you sure you want to delete this assessment?
  </p>

  <div className="delete-btn-group">

    <button
      className="delete-confirm-btn"
      onClick={handleConfirmDelete}
    >
      Yes Delete
    </button>

    <button
      className="cancel-btn"
      onClick={closeAssessmentDialog}
    >
      Cancel
    </button>

  </div>

</div>
  </div>
)}
      </div>

    </div>

  );
};

export default Assessments;
