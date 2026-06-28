import { useState } from "react";
import Step1Metadata from "../../components/mentor/challenges/Step1Metadata";
import Step2TestCases from "../../components/mentor/challenges/Step2TestCases";

const ChallengeCreatorPage = () => {
  const [step, setStep] = useState(1);

  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    maxScore: "",
    allowedLanguages: [],
  });

  const handleNext = (updatedData) => {
    setChallengeData(updatedData);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "32px",
          boxSizing: "border-box",
        }}
      >
        {/* Heading */}
        <h2
          style={{
            margin: "0 0 30px",
            color: "#111827",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Coding Challenge Creator
        </h2>

        {/* Stepper */}
        <div
          style={{
            display: "flex",
            marginBottom: "32px",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "center",
              paddingBottom: "12px",
              borderBottom:
                step === 1
                  ? "3px solid #2563EB"
                  : "3px solid #E5E7EB",
              color: step === 1 ? "#2563EB" : "#6B7280",
              fontWeight: "600",
            }}
          >
            1. Challenge Metadata
          </div>

          Metadata
        </div>

        <div
          style={{
            flex: 1,
            height: "2px",
            background: "#E5E7EB",
            margin: "0 20px",
          }}
        />

        {/* Step 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: step === 2 ? "#2563EB" : "#9CA3AF",
            fontWeight: "600",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: step === 2 ? "#2563EB" : "#E5E7EB",
              color: step === 2 ? "#fff" : "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
            }}
          >
            2
          </div>

          Test Cases
        </div>
      </div>

        {/* Page Content */}
        {step === 1 ? (
          <Step1Metadata
            formData={challengeData}
            setFormData={setChallengeData}
            onNext={handleNext}
          />
        ) : (
          <Step2TestCases
            challengeData={challengeData}
            onBack={handleBack}
          />
        )}
      </div>
    
  );
};

export default ChallengeCreatorPage;