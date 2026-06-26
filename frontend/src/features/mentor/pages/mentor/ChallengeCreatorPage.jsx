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
      background: "#F3F4F6",
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        padding: "40px",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "10px",
        }}
      >
        Create New Challenge
      </h1>

      <p
        style={{
          color: "#6B7280",
          marginBottom: "35px",
        }}
      >
        Create a coding challenge in two simple steps.
      </p>

      {/* Stepper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        {/* Step 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: step === 1 ? "#2563EB" : "#9CA3AF",
            fontWeight: "600",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: step === 1 ? "#2563EB" : "#E5E7EB",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
            }}
          >
            1
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
  </div>
);
};

export default ChallengeCreatorPage;