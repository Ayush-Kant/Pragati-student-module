import React, { useState, useEffect } from "react";
import TestCaseRow from "./TestCaseRow";

const Step2TestCases = ({ challengeData, onBack }) => {
  const [testCases, setTestCases] = useState([
    {
      id: Date.now(),
      input: "",
      output: "",
      timeLimit: 2000,
      weight: 0,
      hidden: false,
    },
  ]);

  const [totalWeight, setTotalWeight] = useState(0);
  const [isValid, setIsValid] = useState(false);

  // Add new test case
  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        input: "",
        output: "",
        timeLimit: 2000,
        weight: 0,
        hidden: false,
      },
    ]);
  };

  // Update test case
  const updateTestCase = (id, updatedData) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id ? { ...tc, ...updatedData } : tc
      )
    );
  };

  // Delete test case
  const deleteTestCase = (id) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  };

  // Validate weight sum
  useEffect(() => {
    const total = testCases.reduce(
      (sum, tc) => sum + Number(tc.weight || 0),
      0
    );

    setTotalWeight(total);
    setIsValid(total === 100);
  }, [testCases]);

  return (
<<<<<<< HEAD
    <div
  style={{
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    padding: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  }}
>
      {/* Header */}
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
        fontSize: "26px",
        fontWeight: "700",
      }}
    >
      Test Cases
    </h2>

    <p
      style={{
        color: "#6B7280",
        marginTop: "8px",
      }}
    >
      {challengeData.title}
    </p>
  </div>

  <button
    onClick={addTestCase}
    style={{
      background: "#2563EB",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    + Add Test Case
  </button>
</div>
=======
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Define Test Cases</h2>

        <button onClick={addTestCase}>
          + Add Test Case
        </button>
      </div>
>>>>>>> 586c829 (fetch: Complete reamaining frontend changes)

      {/* Challenge Info */}
      <p style={{ color: "#6B7280" }}>
        Challenge: {challengeData?.title}
      </p>

      {/* Test Case List */}
      {testCases.map((tc, index) => (
        <TestCaseRow
          key={tc.id}
          index={index + 1}
          data={tc}
          onChange={(updated) =>
            updateTestCase(tc.id, updated)
          }
          onDelete={() => deleteTestCase(tc.id)}
        />
      ))}

      {/* Floating Validation Badge */}
<<<<<<< HEAD
    <div
  style={{
    position: "fixed",
    right: "25px",
    bottom: "25px",
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,.15)",
    minWidth: "180px",
    textAlign: "center",
  }}
>
  <h4
    style={{
      margin: 0,
      color: "#374151",
    }}
  >
    Weight Distribution
  </h4>

  <h2
    style={{
      margin: "10px 0",
      color: isValid ? "#16A34A" : "#DC2626",
    }}
  >
    {totalWeight}%
  </h2>

  <small
    style={{
      color: isValid ? "#16A34A" : "#DC2626",
    }}
  >
    {isValid
      ? "Ready to Publish"
      : "Total should be 100%"}
  </small>
</div>

      {/* Bottom Bar */}
      <div
  style={{
    marginTop: "35px",
    display: "flex",
    justifyContent: "space-between",
  }}
>
  <button
    onClick={onBack}
    style={{
      padding: "12px 24px",
      border: "1px solid #D1D5DB",
      background: "#fff",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    ← Back
  </button>

  <button
    disabled={!isValid}
    style={{
      padding: "12px 28px",
      border: "none",
      borderRadius: "8px",
      background: isValid ? "#2563EB" : "#9CA3AF",
      color: "#fff",
      cursor: isValid ? "pointer" : "not-allowed",
      fontWeight: "600",
    }}
  >
    Publish Challenge
  </button>
</div>
=======
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          borderRadius: "8px",
          color: "white",
          backgroundColor: isValid ? "#10B981" : "#EF4444",
          fontWeight: "bold",
        }}
      >
        Total Weight: {totalWeight}%
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button onClick={onBack}>← Back</button>

        <button
          disabled={!isValid}
          style={{
            padding: "10px 20px",
            background: isValid ? "#2563EB" : "#9CA3AF",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Publish Challenge
        </button>
      </div>
>>>>>>> 586c829 (fetch: Complete reamaining frontend changes)
    </div>
  );
};

export default Step2TestCases;