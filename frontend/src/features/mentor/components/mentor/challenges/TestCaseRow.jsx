import React from "react";

const TestCaseRow = ({ data, onChange, onDelete, index }) => {
  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Test Case {index}</h3>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={data.hidden}
            onChange={(e) =>
              onChange({ hidden: e.target.checked })
            }
            style={styles.checkbox}
          />
          Hidden
        </label>
      </div>

      {/* Textareas */}

      <div style={styles.grid}>
        <div>
          <label style={styles.label}>Standard Input</label>

          <textarea
            value={data.input}
            placeholder="Enter input..."
            onChange={(e) =>
              onChange({ input: e.target.value })
            }
            style={styles.textarea}
          />
        </div>

        <div>
          <label style={styles.label}>Expected Output</label>

          <textarea
            value={data.output}
            placeholder="Enter expected output..."
            onChange={(e) =>
              onChange({ output: e.target.value })
            }
            style={styles.textarea}
          />
        </div>
      </div>

      {/* Bottom Row */}

      <div style={styles.bottomRow}>
        <div>
          <label style={styles.label}>
            Time Limit (ms)
          </label>

          <input
            type="number"
            value={data.timeLimit}
            onChange={(e) =>
              onChange({ timeLimit: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>
            Weight (%)
          </label>

          <input
            type="number"
            value={data.weight}
            onChange={(e) =>
              onChange({ weight: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <button
          onClick={onDelete}
          style={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(15,23,42,.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "20px",
    fontWeight: "700",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6B7280",
    fontWeight: "500",
  },

  checkbox: {
    accentColor: "#2563EB",
    width: "16px",
    height: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#111827",
    fontWeight: "600",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    minHeight: "130px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },

  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "20px",
    alignItems: "end",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  deleteBtn: {
    background: "#EF4444",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    height: "46px",
  },
};

export default TestCaseRow;