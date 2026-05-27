// OnboardingWizard.jsx
// Purpose: 4-step onboarding wizard shell with progress bar guiding new students through profile setup (SM-01)

import { useState } from "react";

import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepAcademics from "./steps/StepAcademics";
import StepSkills from "./steps/StepSkills";
import StepResume from "./steps/StepResume";

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;

  const stepTitles = {
    1: "Personal Info",
    2: "Academic Details",
    3: "Skills",
    4: "Upload Resume",
  };

  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPersonalInfo />;
      case 2:
        return <StepAcademics />;
      case 3:
        return <StepSkills />;
      case 4:
        return <StepResume />;
      default:
        return <StepPersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-100/70 border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
        
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Onboarding
            </span>
            <p className="text-xs font-medium text-slate-400">
              Step <span className="text-slate-700 font-bold">{currentStep}</span> of {totalSteps}
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            {stepTitles[currentStep]}
          </h2>

          {/* Clean Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        {/* Step Content Area (Consistent Height) */}
        <div className="min-h-[300px] my-6 py-2 text-slate-600">
          {renderStep()}
        </div>

        {/* Bottom Section: Actions & Indicators */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          
          {/* Step Indicator Dots */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? "w-5 h-2 bg-blue-600"
                    : step < currentStep
                    ? "w-2 h-2 bg-blue-400"
                    : "w-2 h-2 bg-slate-200"
                }`}
              ></div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            {/* Back Button Container */}
            <div className="w-1/2">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="w-full text-center px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-slate-800 active:scale-[0.98] transition-all duration-200"
                >
                  Back
                </button>
              )}
            </div>

            {/* Next / Submit Button */}
            <button
              onClick={nextStep}
              className={`w-full ${
                currentStep > 1 ? "w-1/2" : "w-full"
              } px-5 py-2.5 rounded-xl font-medium text-sm text-center text-white shadow-sm transition-all duration-200 active:scale-[0.98] ${
                currentStep === totalSteps
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              {currentStep === totalSteps ? "Submit" : "Next"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OnboardingWizard;