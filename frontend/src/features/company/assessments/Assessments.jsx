import React, { useState } from "react";
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

const Assessments = () => {
  const [showPanel, setShowPanel] = useState(false);

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
    />

  </div>

  <button className="filter-btn">
    <FiFilter />
    Type
  </button>

  <button className="filter-btn">
    <FiFilter />
    Difficulty
  </button>

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

                  {assessmentData.map((item) => (

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

                      <td>⋮</td>

                    </tr>

                  ))}

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