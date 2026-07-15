import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getCertificateTemplate,
  saveCertificateTemplate,
} from "../services/certificateService";

// -----------------------------
// Validation Schema
// -----------------------------
const certificateSchema = z.object({
  primaryColor: z
    .string()
    .min(1, "Primary color is required"),

  secondaryColor: z
    .string()
    .min(1, "Secondary color is required"),

  skills: z.array(z.string()).optional(),

  logo: z.any().optional(),

  signature: z.any().optional(),
});

export const useCertificateTemplate = () => {
  const navigate = useNavigate();

  const [templateData, setTemplateData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificateSchema),

    defaultValues: {
      primaryColor: "#2563EB",
      secondaryColor: "#9333EA",
      skills: [],
      logo: null,
      signature: null,
    },
  });

  // -----------------------------
  // Load Template
  // -----------------------------
  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);

      const data = await getCertificateTemplate();

      setTemplateData(data);

      reset({
        primaryColor: data.brandColors?.primary || "#2563EB",
        secondaryColor: data.brandColors?.secondary || "#9333EA",
        skills: data.skillTags || [],
        logo: data.logo || null,
        signature: data.signature || null,
      });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
      }

      setError("Unable to load certificate template.");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // Save Template
  // -----------------------------
  const onSubmit = async (values) => {
    try {
      setIsSaving(true);

      const payload = {
        brandColors: {
          primary: values.primaryColor,
          secondary: values.secondaryColor,
        },

        skillTags: values.skills,

        logo: values.logo,

        signature: values.signature,
      };

      const response = await saveCertificateTemplate(payload);

      setTemplateData(response);

      alert("Template saved successfully.");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
      }

      setError("Unable to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    watch,
    setValue,
    control,
    handleSubmit,
    errors,

    templateData,

    isLoading,
    isSaving,

    error,

    onSubmit,
  };
};