import React, { useState } from "react";
import { Link } from "react-router-dom";
import Step1BasicInfo from "../../components/mentor/courses/steps/Step1BasicInfo";
import Step2Curriculum from "../../components/mentor/courses/steps/Step2Curriculum";
import Step4AdditionalSettings from "../../components/mentor/courses/steps/Step4AdditionalSettings";
import Step3Pricing from "../../components/mentor/courses/steps/Step3Pricing";

const STEPS = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Curriculum" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Additional Settings" },
];

export default function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    subcategory: "",
    level: "Beginner",
    language: "",
    estimatedDuration: "",
    prerequisites: "",
    skillTags: [],
    driveId: "",
    thumbnail: null,
    visibility: "Draft",
    modules: [],
    additionalCategories: [],
    additionalTags: [],
    requirements: "",
    allowSelfEnroll: true,
    requireApproval: false,
    enableCertificate: true,
    downloadableCertificate: true,
    enableDiscussion: true,
    enableReviews: true,
    previewLectureId: "",
    metaTitle: "",
    metaDescription: "",
  });

  const handleUpdate = (fields) => {
    setCourseData((prev) => ({ ...prev, ...fields }));
  };

  const isStep1Valid = () => {
    return (
      courseData.title.trim().length >= 3 &&
      courseData.title.length <= 100 &&
      courseData.shortDescription.trim().length > 0 &&
      courseData.category &&
      courseData.language &&
      courseData.estimatedDuration &&
      courseData.skillTags.length >= 1 &&
      courseData.driveId
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-1">
      <div className="text-sm">
        <Link className="text-zinc-500" to={"/mentor/courses"}>
          Courses
        </Link>{" "}
        &gt; Create New Course
      </div>
      <div className="flex justify-between">
        <div>
          <h1 className="font-bold text-2xl mt-2">Create New Course</h1>
          <p className="text-zinc-500">
            Add course details and build an engaging learning experience.
          </p>
        </div>
        <div>
          <button
            type="button"
            class="break-inside rounded-lg p-2 mb-4 mr-3 border border-zinc-400 text-black hover:bg-indigo-500 hover:text-white cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <span class="text-base font-medium">Save as Draft</span>
            </div>
          </button>
          <button
            type="button"
            class="break-inside rounded-lg p-2 mb-4 mr-3 bg-indigo-500 border border-indigo-500 hover:bg-indigo-700 cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <span class="text-base font-medium text-white">
                Publish Course
              </span>
            </div>
          </button>
        </div>
      </div>
      <div className="p-4 mt-3 border border-neutral-200">
        <div className="flex items-center justify-between relative">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="relative flex items-center gap-3 z-10 bg-gray-50 px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-sm font-medium ${currentStep === step.id ? "text-blue-600 font-semibold " : "text-gray-500"}`}
                >
                  {step.label}
                </span>
                {index < STEPS.length && (
                  <div
                    className={`absolute w-full h-0.5 mt-11 transition-colors ${currentStep === step.id ? "bg-blue-600" : "none"}`}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <main className="max-w-7xl mx-auto mt-2">
        {currentStep === 1 && (
          <Step1BasicInfo
            courseData={courseData}
            onUpdate={handleUpdate}
            onNext={() => setCurrentStep(2)}
            isValid={isStep1Valid()}
          />
        )}
        {currentStep === 2 && (
          <Step2Curriculum
            courseData={courseData}
            onUpdate={handleUpdate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Pricing
            courseData={courseData}
            onUpdate={handleUpdate}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4AdditionalSettings
            courseData={courseData}
            onUpdate={handleUpdate}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </main>
    </div>
  );
}
