import React from "react";

<<<<<<< HEAD
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

=======
>>>>>>> 586c829 (fetch: Complete reamaining frontend changes)
const TestCaseRow = ({ data, onChange, onDelete, index }) => {
  return (
    <div
      style={{
<<<<<<< HEAD
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "20px",
            color: "#111827",
          }}
        >
          Test Case {index}
        </h3>

        <button
          onClick={onDelete}
          style={{
            background: "#EF4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Delete
        </button>
      </div>

      {/* Input & Output */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label style={{ fontWeight: "600" }}>
            Input (stdin)
          </label>

          <textarea
            rows={6}
            value={data.input}
            onChange={(e) =>
              onChange({ input: e.target.value })
            }
            placeholder="Enter input..."
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>
            Expected Output
          </label>

          <textarea
            rows={6}
            value={data.output}
            onChange={(e) =>
              onChange({ output: e.target.value })
            }
            placeholder="Enter expected output..."
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "20px",
          alignItems: "end",
        }}
      >
        <div>
          <label style={{ fontWeight: "600" }}>
            Time Limit (ms)
          </label>

          <input
            type="number"
            value={data.timeLimit}
            onChange={(e) =>
              onChange({ timeLimit: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600" }}>
            Weight (%)
          </label>

          <input
            type="number"
            value={data.weight}
            onChange={(e) =>
              onChange({ weight: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div style={{ paddingBottom: "10px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
            }}
          >
            <input
              type="checkbox"
              checked={data.hidden}
              onChange={(e) =>
                onChange({
                  hidden: e.target.checked,
                })
              }
            />

            Hidden Case
          </label>
        </div>
      </div>
=======
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
        🗑 Delete
      </button>
>>>>>>> 586c829 (fetch: Complete reamaining frontend changes)
    </div>
  );
};

export default TestCaseRow;