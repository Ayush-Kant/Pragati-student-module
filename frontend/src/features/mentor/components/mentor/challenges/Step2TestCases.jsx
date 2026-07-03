import React, { useState, useEffect } from "react";
import TestCaseRow from "./TestCaseRow";
// Import the custom hook 
import { useChallenge } from "../../../hooks/useChallenge";

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

  // Bring in the hook for Mentor actions
  const { isLoading, createNewChallenge, saveTestCases } = useChallenge();

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

  const updateTestCase = (id, updatedData) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id ? { ...tc, ...updatedData } : tc
      )
    );
  };

  const deleteTestCase = (id) => {
    setTestCases((prev) =>
      prev.filter((tc) => tc.id !== id)
    );
  };

  useEffect(() => {
    const total = testCases.reduce(
      (sum, tc) => sum + Number(tc.weight || 0),
      0
    );

    setTotalWeight(total);
    setIsValid(total === 100);
  }, [testCases]);

  // Handle the full submission flow
  const handlePublish = async () => {
    if (!isValid || isLoading) return;

    // 1. Create the challenge using data passed from Step 1
    const newChallengeId = await createNewChallenge(challengeData);
    
    // 2. If metadata saved successfully, attach the test cases
    if (newChallengeId) {
      const success = await saveTestCases(newChallengeId, testCases);
      if (success) {
        // You can add a redirect here later (e.g., navigate('/mentor/dashboard'))
        console.log("Challenge created successfully!");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Heading */}
        <h1 style={styles.heading}>Create New Challenge</h1>

        {/* Stepper */}
        <div style={styles.stepper}>
          <div style={styles.completedStep}>✓</div>
          <span style={styles.completedText}>Metadata</span>
          <div style={styles.line}></div>
          <div style={styles.activeStep}>2</div>
          <span style={styles.activeText}>Test Cases</span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Test Cases</h2>
            <p style={styles.subtitle}>Define inputs and expected outputs.</p>
          </div>
          <button onClick={addTestCase} style={styles.addButton}>
            + Add Test Case
          </button>
        </div>

        {/* Test Case Cards */}
        {testCases.map((tc, index) => (
          <TestCaseRow
            key={tc.id}
            index={index + 1}
            data={tc}
            onChange={(updated) => updateTestCase(tc.id, updated)}
            onDelete={() => deleteTestCase(tc.id)}
          />
        ))}

        {/* Weight Validation Card */}
        <div style={styles.weightCard}>
          <h3 style={styles.weightTitle}>Weight Distribution</h3>
          <h1
            style={{
              ...styles.weightValue,
              color: isValid ? "#10B981" : "#EF4444",
            }}
          >
            {totalWeight}%
          </h1>
          <p
            style={{
              ...styles.weightStatus,
              color: isValid ? "#10B981" : "#EF4444",
            }}
          >
            {isValid ? "Ready to Publish" : "Total should equal 100%"}
          </p>
        </div>

        {/* Bottom Buttons */}
        <div style={styles.footer}>
          <button onClick={onBack} style={styles.backBtn}>
            ← Back
          </button>

          <button
            onClick={handlePublish}
            disabled={!isValid || isLoading}
            style={{
              ...styles.publishBtn,
              background: (isValid && !isLoading) ? "#2563EB" : "#9CA3AF",
              cursor: (isValid && !isLoading) ? "pointer" : "not-allowed",
            }}
          >
            {isLoading ? "Publishing..." : "Publish Challenge"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#F8FAFC", padding: "32px" },
  container: { maxWidth: "1100px", margin: "0 auto", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 10px rgba(15,23,42,.05)" },
  heading: { fontSize: "30px", fontWeight: "700", color: "#111827", marginBottom: "28px" },
  stepper: { display: "flex", alignItems: "center", marginBottom: "32px" },
  completedStep: { width: "34px", height: "34px", borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "700" },
  activeStep: { width: "34px", height: "34px", borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "700" },
  completedText: { marginLeft: "10px", color: "#111827", fontWeight: "600" },
  activeText: { marginLeft: "10px", color: "#111827", fontWeight: "600" },
  line: { flex: 1, height: "2px", background: "#E5E7EB", margin: "0 18px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#111827", margin: 0 },
  subtitle: { marginTop: "6px", color: "#6B7280" },
  addButton: { background: "#2563EB", color: "#FFFFFF", border: "none", padding: "12px 22px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  weightCard: { position: "fixed", right: "30px", bottom: "30px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "18px", width: "210px", boxShadow: "0 8px 24px rgba(0,0,0,.08)", textAlign: "center" },
  weightTitle: { margin: 0, color: "#111827", fontSize: "16px" },
  weightValue: { margin: "12px 0", fontSize: "34px", fontWeight: "700" },
  weightStatus: { margin: 0, fontSize: "14px", fontWeight: "500" },
  footer: { display: "flex", justifyContent: "space-between", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #F1F5F9" },
  backBtn: { padding: "12px 24px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "10px", color: "#6B7280", fontWeight: "600", cursor: "pointer" },
  publishBtn: { padding: "12px 28px", color: "#FFFFFF", border: "none", borderRadius: "10px", fontWeight: "600", fontSize: "15px" },
};

export default Step2TestCases;