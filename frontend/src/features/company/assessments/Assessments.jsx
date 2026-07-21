import { useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import "./Assessments.css";

import { FiSearch } from "react-icons/fi";
import { useCompanyAssessments } from '../hooks/useCompanyAssessments';
import { useCompanyDrives } from '../hooks/useCompanyDrives';
import { assessmentsService } from '../services/assessmentsService';

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
  const {
    assessments,
    loading: loadingAssessments,
    error: errorAssessments,
    refreshAssessments,
    createAssessment,
    updateAssessment,
    archiveAssessment,
  } = useCompanyAssessments();

  const {
    drives,
    loading: loadingDrives
  } = useCompanyDrives();

  const [showPanel, setShowPanel] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [dialogMode, setDialogMode] = useState(null); // 'view' | 'edit' | 'delete'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  
  const [editForm, setEditForm] = useState({
    title: "",
    type: "Technical",
    difficulty: "Medium",
    duration: "",
  });

  const [testTitle, setTestTitle] = useState("");
  const [testType, setTestType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [selectedDriveId, setSelectedDriveId] = useState("");
  
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
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
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
      duration: String(assessment.time_limit_minutes || 60),
    });
    setDialogMode("edit");
  };

  const handleDuplicateAssessment = async (assessment) => {
    try {
      await createAssessment({
        title: `${assessment.title} (Copy)`,
        type: assessment.type,
        difficulty: assessment.difficulty,
        duration: assessment.time_limit_minutes || 60,
        total_marks: assessment.total_marks || 100
      });
      toast.success('Assessment duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate assessment');
    }
  };

  const handleDeleteRequest = (assessment) => {
    setSelectedAssessment(assessment);
    setDialogMode("delete");
  };

  const handleSaveAssessment = async (event) => {
    event.preventDefault();
    try {
      await updateAssessment(selectedAssessment.id, {
        title: editForm.title,
        type: editForm.type,
        difficulty: editForm.difficulty,
        duration: parseInt(editForm.duration, 10) || 60
      });
      toast.success('Assessment updated successfully');
      closeAssessmentDialog();
    } catch (err) {
      toast.error('Failed to update assessment');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await archiveAssessment(selectedAssessment.id);
      toast.success('Assessment archived successfully');
      closeAssessmentDialog();
    } catch (err) {
      toast.error('Failed to delete assessment');
    }
  };

  const publishAssessment = async () => {
    if (!testTitle.trim()) {
      toast.error('Please enter a test title');
      return;
    }

    try {
      // Create assessment
      const res = await assessmentsService.create({
        title: testTitle,
        type: testType,
        difficulty,
        duration: parseInt(duration, 10) || 60,
        total_marks: 100
      });

      // If drive is selected, assign it
      if (selectedDriveId && res?.data?.id) {
        await assessmentsService.assignToDrive(res.data.id, selectedDriveId);
        toast.success('Assessment created and assigned to drive successfully');
      } else {
        toast.success('Assessment created successfully');
      }

      await refreshAssessments();
      setShowPanel(false);

      setTestTitle("");
      setTestType("Technical");
      setDifficulty("Medium");
      setDuration("");
      setPassingScore("");
      setSelectedDriveId("");
    } catch (err) {
      toast.error('Failed to publish assessment');
    }
  };

  if (loadingAssessments) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin inline-block"></div>
          <p className="text-gray-600 mt-4 font-semibold">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessments-wrapper">
      {errorAssessments && (
        <div className="mx-8 my-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium">
          {errorAssessments}
        </div>
      )}

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
              <p>Create and manage technical assessments</p>
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
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., React Developer Assessment"
              />

              <div className="double-row">
                <div>
                  <label>Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
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
                    onChange={(e) => setDifficulty(e.target.value)}
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
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                  />
                </div>

                <div>
                  <label>Passing Score (%)</label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
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
                <div className="question-box" key={question.id}>
                  <div className="question-top">
                    <p>Question {index + 1}</p>
                    <button
                      className="delete-btn"
                      onClick={() => deleteQuestion(question.id)}
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
                      updatedQuestions[index].question = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                  />

                  <div className="options-grid">
                    {question.options.map((option, optionIndex) => (
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
                            updatedQuestions[index].options[optionIndex] = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="assign-drive-box">
              <h3>Assign Assessment To Drive</h3>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
              >
                <option value="">Select Drive</option>
                {drives.map(d => (
                  <option key={d.id} value={d.id}>{d.driveName}</option>
                ))}
              </select>
              <button
                type="button"
                className="assign-btn"
                onClick={() => {
                  if (!selectedDriveId) {
                    toast.error('Please select a drive first');
                    return;
                  }
                  toast.success('Assessment will be assigned upon publishing');
                }}
              >
                Assign Assessment
              </button>
            </div>

            <div className="panel-footer">
              <button
                className="draft-btn"
                onClick={() => setShowPanel(false)}
              >
                Cancel
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
                onClick={closeAssessmentDialog}
              >
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
                  required
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
                  type="number"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="Duration (mins)"
                  required
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
              <h2 className="delete-title">Delete Assessment</h2>
              <h3 className="delete-assessment-name">{selectedAssessment.title}</h3>
              <p className="delete-text">Are you sure you want to delete this assessment?</p>
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
