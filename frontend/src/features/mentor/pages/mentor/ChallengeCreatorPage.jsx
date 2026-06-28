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
        background: "#F8FAFC",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "32px",
          }}
        >
          Create New Challenge
        </h1>

        {/* Stepper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: step === 1 ? "#2563EB" : "#E5E7EB",
                color: step === 1 ? "#fff" : "#6B7280",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "600",
              }}
            >
              1
            </div>

            <span
              style={{
                marginLeft: "12px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Metadata
            </span>
          </div>

          {/* Line */}
          <div
            style={{
              flex: 1,
              height: "2px",
              background: "#E5E7EB",
              margin: "0 24px",
            }}
          />

          {/* Step 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: step === 2 ? "#2563EB" : "#E5E7EB",
                color: step === 2 ? "#fff" : "#6B7280",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "600",
              }}
            >
              2
            </div>

            <span
              style={{
                marginLeft: "12px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Test Cases
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "32px",
          }}
        >
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
    </div>
  );
};

export default ChallengeCreatorPage;