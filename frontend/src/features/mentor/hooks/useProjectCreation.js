import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import projectCreationService from "../services/projectCreationService";

// Helper to validate date is not in the past
const isNotPastDate = (dateStr) => {
  if (!dateStr) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateStr);
  return selectedDate >= today;
};

// Zod validation schema
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().max(300, "Short description is too long").optional().or(z.literal("")),
  problemStatement: z.string().min(10, "Problem statement/project statement must be at least 10 characters"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Select a valid difficulty level" })
  }),
  duration: z.string().min(1, "Estimated duration is required"),
  visibility: z.boolean(),
  projectType: z.enum(["individual", "team"]),
  teamSize: z.object({
    min: z.number().int().min(1, "Min team size must be at least 1"),
    max: z.number().int().min(1, "Max team size must be at least 1")
  }).refine(data => data.min <= data.max, {
    message: "Max team size cannot be less than min team size",
    path: ["max"]
  }),
  allowStudentInvitations: z.boolean(),
  mentorApprovalRequired: z.boolean(),
  skillTags: z.array(z.string()).min(1, "Add at least one skill tag"),
  deliverables: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(2, "Deliverable title must be at least 2 characters"),
      required: z.boolean()
    })
  ).min(1, "Add at least one deliverable"),
  rubrics: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(2, "Criterion name is required"),
      description: z.string().optional().or(z.literal("")),
      weight: z.number().min(1, "Weight must be positive").max(100, "Weight cannot exceed 100")
    })
  ).min(1, "Add at least one evaluation criterion"),
  allowLateSubmission: z.boolean(),
  aiReview: z.boolean(),
  allowResubmission: z.boolean(),
  certificateEligible: z.boolean(),
  publicLeaderboard: z.boolean(),
  submissionDeadline: z.string().min(1, "Submission deadline is required").refine(isNotPastDate, {
    message: "Deadline cannot be in the past"
  }),
  maxAttempts: z.number().int().min(1, "Maximum attempts must be at least 1")
});

const defaultValues = {
  title: "",
  description: "",
  problemStatement: "",
  difficulty: "Intermediate",
  duration: "",
  visibility: true,
  projectType: "individual",
  teamSize: { min: 2, max: 4 },
  allowStudentInvitations: true,
  mentorApprovalRequired: false,
  skillTags: [],
  deliverables: [
    { id: "del-1", title: "GitHub Repository", required: true },
    { id: "del-2", title: "Deployment URL", required: true },
    { id: "del-3", title: "README Documentation", required: false }
  ],
  rubrics: [
    { id: "rub-1", title: "Code Quality & Architecture", weight: 30, description: "Cleanliness, structure, and modulatiry of code" },
    { id: "rub-2", title: "Feature Completeness", weight: 40, description: "Implementation of core application features" },
    { id: "rub-3", title: "Documentation & Readme", weight: 15, description: "Quality of instructions and repository details" },
    { id: "rub-4", title: "Testing & Deployment", weight: 15, description: "Application deployment status and unit tests" }
  ],
  allowLateSubmission: false,
  aiReview: true,
  allowResubmission: true,
  certificateEligible: true,
  publicLeaderboard: true,
  submissionDeadline: "",
  maxAttempts: 3
};

export const useProjectCreation = (onSuccess) => {
  const [skillsList, setSkillsList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues
  });

  const {
    fields: deliverablesFields,
    append: appendDeliverable,
    remove: removeDeliverable,
    move: moveDeliverable,
    replace: replaceDeliverables
  } = useFieldArray({
    control,
    name: "deliverables"
  });

  const {
    fields: rubricsFields,
    append: appendRubric,
    remove: removeRubric
  } = useFieldArray({
    control,
    name: "rubrics"
  });

  // Watch fields for live preview
  const formValues = watch();

  // Load initial skills and templates
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [skillsData, templatesData] = await Promise.all([
          projectCreationService.fetchSkills(),
          projectCreationService.fetchTemplates()
        ]);
        setSkillsList(skillsData);
        setTemplates(templatesData);
      } catch (err) {
        setApiError("Failed to fetch initial page data. Some components may use mock configuration.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Compute total rubric weight
  const rubricsList = watch("rubrics") || [];
  const totalRubricWeight = rubricsList.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  const isRubricWeightValid = totalRubricWeight === 100;

  // Submit handler (Draft vs Publish)
  const onSubmit = async (data, action = "publish") => {
    if (!isRubricWeightValid) {
      toast.error(`Evaluation rubrics must equal exactly 100%. Current total: ${totalRubricWeight}%`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...data,
        status: action === "draft" ? "draft" : "published"
      };
      
      const response = await projectCreationService.createProject(payload);
      
      if (response.success || response.id) {
        toast.success(`Project ${action === "draft" ? "saved as draft" : "published successfully"}!`);
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to complete request.");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    errors,
    formValues,
    
    // Skill tags
    skillsList,
    setSkillsList,
    
    // Templates
    templates,
    
    // Deliverables array
    deliverablesFields,
    appendDeliverable,
    removeDeliverable,
    moveDeliverable,
    replaceDeliverables,
    
    // Rubrics array
    rubricsFields,
    appendRubric,
    removeRubric,
    totalRubricWeight,
    isRubricWeightValid,
    
    // Loading/Error status
    loading,
    submitting,
    apiError,
    
    // Action helpers
    onSubmit
  };
};

export default useProjectCreation;
