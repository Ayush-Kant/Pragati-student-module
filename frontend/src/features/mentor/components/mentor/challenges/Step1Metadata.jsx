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
  <div
    style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      padding: "30px",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "30px",
      }}
    >
      {/* LEFT SIDE */}
      <div>
        {/* Title */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: 600 }}>Challenge Title *</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Reverse Linked List"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          {errors.title && (
            <p style={{ color: "red" }}>{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label style={{ fontWeight: 600 }}>
            Description *
          </label>

          <textarea
            rows={12}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write challenge description..."
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />

          {errors.description && (
            <p style={{ color: "red" }}>
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: 600 }}>
            Max Score *
          </label>

          <input
            type="number"
            name="maxScore"
            value={formData.maxScore}
            onChange={handleChange}
            placeholder="100"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
            }}
          />

          {errors.maxScore && (
            <p style={{ color: "red" }}>
              {errors.maxScore}
            </p>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>
            Allowed Languages
          </label>

          <div style={{ marginTop: "12px" }}>
            {LANGUAGE_OPTIONS.map((language) => (
              <div
                key={language}
                style={{ marginBottom: "10px" }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={formData.allowedLanguages.includes(language)}
                    onChange={() =>
                      handleLanguageChange(language)
                    }
                  />{" "}
                  {language}
                </label>
              </div>
            ))}
          </div>

          {errors.allowedLanguages && (
            <p style={{ color: "red" }}>
              {errors.allowedLanguages}
            </p>
          )}
        </div>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "35px",
      }}
    >
      <button
        onClick={handleNext}
        style={{
          background: "#2563EB",
          color: "#fff",
          border: "none",
          padding: "12px 28px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Next →
      </button>
    </div>
  </div>
);
};

export default Step1Metadata;