import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import useProjectCreation from "../hooks/useProjectCreation";
import ProjectBasicInfo from "../components/ProjectBasicInfo";
import ProjectTypeSelector from "../components/ProjectTypeSelector";
import SkillTagSelector from "../components/SkillTagSelector";
import RichTextEditor from "../components/RichTextEditor";
import DeliverablesChecklist from "../components/DeliverablesChecklist";
import RubricBuilder from "../components/RubricBuilder";
import ProjectSettings from "../components/ProjectSettings";
import StudentPreviewPanel from "../components/StudentPreviewPanel";
import PublishActions from "../components/PublishActions";

export default function ProjectCreationPage() {
  const navigate = useNavigate();

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSuccess = () => {
    navigate("/mentor/dashboard");
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    formValues,
    skillsList,
    templates,
    deliverablesFields,
    appendDeliverable,
    removeDeliverable,
    moveDeliverable,
    rubricsFields,
    appendRubric,
    removeRubric,
    totalRubricWeight,
    isRubricWeightValid,
    loading,
    submitting,
    apiError,
    onSubmit,
  } = useProjectCreation(handleSuccess);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading project configuration and tags...</p>
      </div>
    );
  }

  return (
    <form className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans" onSubmit={(e) => e.preventDefault()}>
      {/* Top Banner API Error */}
      {apiError && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold animate-in slide-in-from-top duration-250">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Header and topbar actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-250">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Create New Project</h1>
          <p className="text-sm text-gray-500 mt-1">Design and configure a new technical assessment project for students.</p>
        </div>
        <PublishActions
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          submitting={submitting}
          isRubricWeightValid={isRubricWeightValid}
          formValues={formValues}
          totalRubricWeight={totalRubricWeight}
        />
      </div>

      {/* Responsive columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form fields column */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {/* Section: Basic Info */}
          <ProjectBasicInfo
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          {/* Section: Project Type */}
          <ProjectTypeSelector
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          {/* Section: Skills Tags */}
          <SkillTagSelector
            watch={watch}
            setValue={setValue}
            errors={errors}
            skillsList={skillsList}
          />

          {/* Section: Rich Text Problem Statement */}
          <RichTextEditor
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            templates={templates}
          />

          {/* Section: Deliverables */}
          <DeliverablesChecklist
            register={register}
            errors={errors}
            deliverablesFields={deliverablesFields}
            appendDeliverable={appendDeliverable}
            removeDeliverable={removeDeliverable}
            moveDeliverable={moveDeliverable}
          />

          {/* Section: Evaluation Rubric */}
          <RubricBuilder
            register={register}
            errors={errors}
            rubricsFields={rubricsFields}
            appendRubric={appendRubric}
            removeRubric={removeRubric}
            totalRubricWeight={totalRubricWeight}
            isRubricWeightValid={isRubricWeightValid}
          />

          {/* Section: Project Settings */}
          <ProjectSettings
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </div>

        {/* Sidebar Live Preview column */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <StudentPreviewPanel
            formValues={formValues}
            isRubricWeightValid={isRubricWeightValid}
            totalRubricWeight={totalRubricWeight}
          />
        </div>
      </div>
    </form>
  );
}
