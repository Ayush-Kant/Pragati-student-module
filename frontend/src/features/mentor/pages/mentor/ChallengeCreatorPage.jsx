import { useState } from "react";
import Step1Metadata from "../components/challenges/Step1Metadata";
import Step2TestCases from "../components/challenges/Step2TestCases";

const ChallengeCreatorPage = () => {
  const [step, setStep] = useState(1);

  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    maxScore: "",
    allowedLanguages: [],
  });

  const nextStep = (data) => {
    setChallengeData(data);
    setStep(2);
  };

  const previousStep = () => {
    setStep(1);
  };

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "30px",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* Heading */}
        <h2
          style={{
            marginBottom: "25px",
            color: "#111827",
          }}
        >
          Coding Challenge Creator
        </h2>

        {/* Stepper */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              borderBottom:
                step === 1
                  ? "3px solid #2563EB"
                  : "3px solid #E5E7EB",
              color: step === 1 ? "#2563EB" : "#6B7280",
              fontWeight: 600,
            }}
          >
            1. Challenge Metadata
          </div>

          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px",
              borderBottom:
                step === 2
                  ? "3px solid #2563EB"
                  : "3px solid #E5E7EB",
              color: step === 2 ? "#2563EB" : "#6B7280",
              fontWeight: 600,
            }}
          >
            2. Test Cases
          </div>
        </div>

        {/* Step Content */}
        {step === 1 ? (
          <Step1Metadata
            formData={challengeData}
            setFormData={setChallengeData}
            onNext={nextStep}
          />
        ) : (
          <Step2TestCases
            challengeData={challengeData}
            onBack={previousStep}
          />
        )}
      </div>
    </div>
  );
};

export default ChallengeCreatorPage;