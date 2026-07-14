import { useState } from 'react';

const mockTemplateData = {
  organizationName: "UptoSkills",
  brandColors: {
    primary: "#2563eb",
    secondary: "#1e293b"
  },
  logoUrl: null, // Set to null so your UI shows the "Logo" placeholder text
  signature: {
    fileName: "signature_mentor1.png",
    url: null, // Set to null to show signature placeholder
    size: "142 KB"
  },
  skillTags: ["React", "Node", "Express", "PostgreSQL"],
  previewPlaceholders: {
    studentName: "[Student Name]",
    programName: "[Full Stack Internship]",
    score: "91%",
    mentorName: "[Mentor Name]"
  }
};

export const useCertificateTemplate = () => {
  // We just return the static mock data for now so Dev B (you) can build the UI
  return {
    templateData: mockTemplateData,
    updateField: (field, value) => {},
    saveTemplate: async () => {},
    isLoading: false,
    error: null
  };
};