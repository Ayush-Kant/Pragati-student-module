
// Replace with the original axios implementation once the backend API is ready.

const mockTemplateData = {
  organizationName: "UptoSkills",
  brandColors: {
    primary: "#2563eb",
    secondary: "#1e293b"
  },
  // Adapted to match the object structure expected by the frontend components
  logo: {
    url: "https://placeholder.com/logo.png",
    preview: "https://placeholder.com/logo.png",
    fileName: "logo.png"
  },
  signature: {
    fileName: "signature_mentor1.png",
    url: "https://placeholder.com/signature.png",
    preview: "https://placeholder.com/signature.png",
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

// =============================
// Template APIs
// =============================

export const getCertificateTemplate = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplateData);
    }, 800); // Simulate network loading time
  });
};

export const saveCertificateTemplate = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock saved payload:", data);
      resolve({ success: true, ...data });
    }, 1500);
  });
};

export const updateCertificateTemplate = async (id, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, ...data });
    }, 1000);
  });
};

// =============================
// Upload APIs
// =============================

export const uploadLogo = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a local object URL to preview the uploaded file instantly
      const fakeUrl = URL.createObjectURL(file);
      resolve({ url: fakeUrl, fileName: file.name });
    }, 1200);
  });
};

export const uploadSignature = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      resolve({ url: fakeUrl, fileName: file.name });
    }, 1200);
  });
};

// =============================
// Skills
// =============================

export const getSkillSuggestions = async (query = "") => {
  const allSkills = [
    "React", "Node", "Express", "PostgreSQL", 
    "MongoDB", "Python", "Java", "Docker", "AWS"
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) return resolve(allSkills);
      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 300);
  });
};