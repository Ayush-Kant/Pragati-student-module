import React, { useState } from "react";

const LANGUAGE_OPTIONS = [
  "Python 3",
  "JavaScript (Node.js)",
  "C++",
  "Java",
  "C",
  "TypeScript",
  "Go",
  "Rust",
];

const Step1Metadata = ({ onNext }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxScore: 100,
    allowedLanguages: ["Python 3", "JavaScript (Node.js)"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData((prev) => ({
      ...prev,
      allowedLanguages: prev.allowedLanguages.includes(lang)
        ? prev.allowedLanguages.filter((l) => l !== lang)
        : [...prev.allowedLanguages, lang],
    }));
  };

  const handleNext = () => {
    if (!formData.title || !formData.description) {
      alert("Title and Description are required.");
      return;
    }

    onNext(formData);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create New Challenge</h1>

        {/* Stepper */}

        <div style={styles.stepper}>
          <div style={styles.activeStep}>1</div>

          <span style={styles.activeText}>Metadata</span>

          <div style={styles.line}></div>

          <div style={styles.inactiveStep}>2</div>

          <span style={styles.inactiveText}>Test Cases</span>
        </div>

        <div style={styles.grid}>

          {/* LEFT SIDE */}

          <div>

            <label style={styles.label}>
              Challenge Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="e.g., Reverse Linked List"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
            />

            <label
              style={{
                ...styles.label,
                marginTop: 24,
              }}
            >
              Rich Description (Markdown)
            </label>

            {/* Toolbar */}

            <div style={styles.toolbar}>
              <button style={styles.toolBtn}>
                <b>B</b>
              </button>

              <button style={styles.toolBtn}>
                <i>I</i>
              </button>

              <button style={styles.toolBtn}>
                {"</>"}
              </button>

              <button style={styles.toolBtn}>
                🔗
              </button>
            </div>

            <textarea
              name="description"
              placeholder="Write challenge description..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          {/* RIGHT SIDE */}

          <div>

            <label style={styles.label}>
              Max Score
            </label>

            <input
              type="number"
              name="maxScore"
              value={formData.maxScore}
              onChange={handleChange}
              style={styles.input}
            />

            <label
              style={{
                ...styles.label,
                marginTop: 24,
              }}
            >
              Allowed Languages
            </label>
            <div style={styles.languageBox}>
              {LANGUAGE_OPTIONS.map((lang) => (
                <label key={lang} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.allowedLanguages.includes(lang)}
                    onChange={() => handleLanguageToggle(lang)}
                    style={styles.checkbox}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            type="button"
            style={styles.cancelBtn}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleNext}
            style={styles.nextBtn}
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "32px",
  },

  card: {
    maxWidth: "1050px",
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
  },

  heading: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "28px",
  },

  stepper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "35px",
  },

  activeStep: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#2563EB",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },

  inactiveStep: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#E5E7EB",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },

  activeText: {
    marginLeft: "10px",
    fontWeight: "600",
    color: "#111827",
  },

  inactiveText: {
    marginLeft: "10px",
    fontWeight: "600",
    color: "#6B7280",
  },

  line: {
    flex: 1,
    height: "2px",
    background: "#E5E7EB",
    margin: "0 18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
  },

  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    background: "#FFFFFF",
    boxSizing: "border-box",
  },

  toolbar: {
    display: "flex",
    gap: "8px",
    background: "#EFF6FF",
    border: "1px solid #E5E7EB",
    borderBottom: "none",
    padding: "10px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },

  toolBtn: {
    width: "34px",
    height: "34px",
    border: "1px solid #E5E7EB",
    borderRadius: "6px",
    background: "#FFFFFF",
    cursor: "pointer",
    color: "#111827",
  },

  textarea: {
    width: "100%",
    minHeight: "260px",
    padding: "14px",
    border: "1px solid #E5E7EB",
    borderTop: "none",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    resize: "vertical",
    fontSize: "14px",
    outline: "none",
    color: "#111827",
    boxSizing: "border-box",
  },

  languageBox: {
    marginTop: "10px",
    padding: "18px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    background: "#FFFFFF",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    color: "#111827",
    fontSize: "14px",
    cursor: "pointer",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#2563EB",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px",
    marginTop: "35px",
    borderTop: "1px solid #F1F5F9",
    paddingTop: "24px",
  },

  cancelBtn: {
    padding: "11px 24px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    background: "#FFFFFF",
    color: "#6B7280",
    cursor: "pointer",
    fontWeight: "600",
  },

  nextBtn: {
    padding: "11px 28px",
    border: "none",
    borderRadius: "10px",
    background: "#2563EB",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default Step1Metadata;