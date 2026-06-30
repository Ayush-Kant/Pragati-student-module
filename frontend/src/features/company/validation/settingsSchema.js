import { z } from "zod";

export const companySettingsSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),

  industry: z
    .string()
    .min(1, "Industry is required"),

  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string()
    .email("Please enter a valid email address"),

  companyAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),

  defaultWorkMode: z
    .enum(["Hybrid", "Remote", "On-site"], {
      errorMap: () => ({ message: "Please select a valid work mode" }),
    }),

  probationPeriod: z
    .number()
    .min(0, "Probation period cannot be less than 0")
    .max(12, "Probation period cannot exceed 12 months"),

  noticePeriod: z
    .number()
    .min(0, "Notice period cannot be less than 0")
    .max(180, "Notice period cannot exceed 180 days"),

  currency: z
    .enum(["INR", "USD", "EUR", "GBP"], {
      errorMap: () => ({ message: "Please select a valid currency" }),
    }),

  notifications: z.object({
    emailNotifications: z.boolean(),
    interviewReminders: z.boolean(),
    weeklyAnalyticsReport: z.boolean(),
    offerNotifications: z.boolean(),
  }),
});

export const logoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must not exceed 5MB"
    )
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/jpg"].includes(
          file.type
        ),
      "Only PNG, JPG, and JPEG files are allowed"
    ),
});
