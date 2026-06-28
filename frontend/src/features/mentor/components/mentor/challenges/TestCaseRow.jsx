import React from "react";

const TestCaseRow = ({ data, onChange, onDelete, index }) => {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
      }}
    >
      <h4>Test Case {index}</h4>

      {/* Input */}
      <div>
        <label>Input (stdin)</label>
        <textarea
          value={data.input}
          onChange={(e) =>
            onChange({ input: e.target.value })
          }
          style={{ width: "100%" }}
        />
      </div>

      {/* Output */}
      <div>
        <label>Expected Output</label>
        <textarea
          value={data.output}
          onChange={(e) =>
            onChange({ output: e.target.value })
          }
          style={{ width: "100%" }}
        />
      </div>

      {/* Time Limit */}
      <div>
        <label>Time Limit (ms)</label>
        <input
          type="number"
          value={data.timeLimit}
          onChange={(e) =>
            onChange({ timeLimit: e.target.value })
          }
        />
      </div>

      {/* Weight */}
      <div>
        <label>Weight (%)</label>
        <input
          type="number"
          value={data.weight}
          onChange={(e) =>
            onChange({ weight: e.target.value })}
        />
      </div>

      {/* Hidden */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.hidden}
            onChange={(e) =>
              onChange({ hidden: e.target.checked })
            }
          />
          Hidden Case
        </label>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{
          marginTop: "10px",
          color: "red",
        }}
      >
        🗑️ Delete
      </button>
    </div>
  );
};

export default TestCaseRow;