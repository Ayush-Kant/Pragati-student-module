import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";

import Step1BasicInfo from "../../../../components/mentor/courses/steps/Step1BasicInfo";
import Step2Curriculum from "../../../../components/mentor/courses/steps/Step2Curriculum";
import Step3Pricing from "../../../../components/mentor/courses/steps/Step3Pricing";
import Step4AdditionalSettings from "../../../../components/mentor/courses/steps/Step4AdditionalSettings";
import { useCourseDetails } from "../hooks/useCourseDetails";
import { updateCourseDetails } from "../services/courseService";
import { ArrowLeft } from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Curriculum" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Additional Settings" },
];

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  shortDescription: z.string().min(1, "Short description is required").max(200, "Short description cannot exceed 200 characters"),
  fullDescription: z.string().min(1, "Full description is required"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Language is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  skillTags: z.array(z.string()).min(1, "At least one skill tag is required"),
});

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: initialData, loading, error, refetch } = useCourseDetails(courseId);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
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
    pricingModel: "Paid",
    currency: "INR",
    basePrice: "",
  });

  useEffect(() => {
    if (initialData) {
      setCourseData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

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
      courseData.skillTags.length >= 1
    );
  };

  const handleSave = async () => {
    try {
      // Validate with Zod
      courseSchema.parse({
        title: courseData.title,
        shortDescription: courseData.shortDescription,
        fullDescription: courseData.fullDescription,
        category: courseData.category,
        language: courseData.language,
        estimatedDuration: courseData.estimatedDuration,
        skillTags: courseData.skillTags,
      });

      setIsSaving(true);
      const updateData = {
        title: courseData.title,
        shortDescription: courseData.shortDescription,
        fullDescription: courseData.fullDescription,
        category: courseData.category,
        subcategory: courseData.subcategory,
        level: courseData.level,
        language: courseData.language,
        estimatedDuration: courseData.estimatedDuration,
        skillTags: courseData.skillTags,
        visibility: courseData.visibility,
        pricingModel: courseData.pricingModel,
        currency: courseData.currency,
        basePrice: courseData.basePrice,
      };

      await updateCourseDetails(courseId, updateData);
      toast.success("Course updated successfully!");
      refetch(); // Refetch to get updated data
      navigate(`/mentor/courses/${courseId}/preview`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => toast.error(e.message));
      } else {
        toast.error("Failed to update course. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-7xl mx-auto">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="h-20 bg-slate-200 rounded w-full"></div>
          <div className="h-64 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm mb-4">
          <Link className="text-zinc-500 hover:text-indigo-600 flex items-center gap-1 w-max" to={`/mentor/courses/${courseId}/preview`}>
            <ArrowLeft className="w-4 h-4" /> Back to Preview
          </Link>
        </div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-bold text-2xl mt-2">Edit Course</h1>
            <p className="text-zinc-500">
              Update course details and settings.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        
        <div className="p-4 mb-6 border border-neutral-200 bg-white rounded-lg">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="relative flex items-center gap-3 z-10 bg-white px-2">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors cursor-pointer ${
                      currentStep === step.id
                        ? "bg-indigo-600 text-white"
                        : currentStep > step.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id}
                  </button>
                  <span
                    className={`text-sm font-medium ${currentStep === step.id ? "text-indigo-600 font-semibold " : "text-gray-500"}`}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`absolute w-full h-0.5 mt-11 transition-colors ${currentStep === step.id ? "bg-indigo-600" : "none"}`}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
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
    </div>
  );
}
