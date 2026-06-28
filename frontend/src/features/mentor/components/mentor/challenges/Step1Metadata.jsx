import React, { useState } from "react";

const LANGUAGE_OPTIONS = [
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Go",
  "Rust",
];

const Step1Metadata = ({ onNext }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxScore: "",
    allowedLanguages: [],
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle checkbox selection
  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const exists = prev.allowedLanguages.includes(language);

      return {
        ...prev,
        allowedLanguages: exists
          ? prev.allowedLanguages.filter((l) => l !== language)
          : [...prev.allowedLanguages, language],
      };
    });

    setErrors((prev) => ({
      ...prev,
      allowedLanguages: "",
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Challenge title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.maxScore || Number(formData.maxScore) <= 0) {
      newErrors.maxScore = "Enter a valid max score.";
    }

    if (formData.allowedLanguages.length === 0) {
      newErrors.allowedLanguages = "Select at least one language.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    if (typeof onNext === "function") {
      onNext(formData);
    } else {
      console.error("onNext prop is missing in Step1Metadata");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Challenge Metadata</h2>

      {/* Title */}
      <div style={{ marginBottom: "20px" }}>
        <label><strong>Challenge Title *</strong></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter challenge title"
          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div style={{ marginBottom: "20px" }}>
        <label><strong>Description *</strong></label>
        <textarea
          name="description"
          rows={6}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter challenge description..."
          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
        />
        {errors.description && (
          <p style={{ color: "red" }}>{errors.description}</p>
        )}
      </div>

      {/* Max Score */}
      <div style={{ marginBottom: "20px" }}>
        <label><strong>Max Score *</strong></label>
        <input
          type="number"
          name="maxScore"
          min="1"
          value={formData.maxScore}
          onChange={handleChange}
          placeholder="100"
          style={{ width: "100%", padding: "10px", marginTop: "8px" }}
        />
        {errors.maxScore && (
          <p style={{ color: "red" }}>{errors.maxScore}</p>
        )}
      </div>

      {/* Languages */}
      <div style={{ marginBottom: "20px" }}>
        <label><strong>Allowed Languages *</strong></label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {LANGUAGE_OPTIONS.map((language) => (
            <label key={language}>
              <input
                type="checkbox"
                checked={formData.allowedLanguages.includes(language)}
                onChange={() => handleLanguageChange(language)}
              />{" "}
              {language}
            </label>
          ))}
        </div>

        {errors.allowedLanguages && (
          <p style={{ color: "red" }}>{errors.allowedLanguages}</p>
        )}
      </div>

      {/* Next Button */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={handleNext}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Next: Test Cases →
        </button>
      </div>
    </div>
  );
};

export default Step1Metadata;