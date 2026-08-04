export const studentProfileData = {
  id: 1,
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  profilePhoto: "",
  department: "Information Technology",
  course: "B.Tech",
  semester: 5,
  cgpa: 8.75,
  skills: ["React", "Node.js", "Java", "Python"],
  certifications: [
    { id: "cert-1", name: "AWS Certified Developer", issuer: "Amazon", year: 2025 },
    { id: "cert-2", name: "Google Associate Android Developer", issuer: "Google", year: 2024 }
  ],
  languages: ["English", "Hindi", "Kannada"],
  bio: "Passionate developer with interest in full-stack development and cloud technologies.",
  address: {
    street: "123 Main Street",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560001"
  },
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Mother",
    phone: "+91 9876543211"
  },
  resume: {
    fileName: "John_Doe_Resume.pdf",
    fileUrl: "https://example.com/resumes/john-doe.pdf",
    uploadedAt: "2026-07-27T10:30:00Z"
  },
  documents: [
    { id: "doc-1", name: "Transcript", type: "pdf", url: "https://example.com/docs/transcript.pdf", uploadedAt: "2026-07-20T14:30:00Z" },
    { id: "doc-2", name: "ID Proof", type: "jpg", url: "https://example.com/docs/id-proof.jpg", uploadedAt: "2026-07-25T09:15:00Z" }
  ],
  socialLinks: {
    linkedIn: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
    twitter: "https://twitter.com/johndoe"
  },
  profileCompletion: 82,
  joinedAt: "2024-06-01T00:00:00Z",
  lastUpdated: "2026-07-27T10:30:00Z"
};

export const studentProfileApiResponse = {
  success: true,
  data: studentProfileData
};

export const profileCompletionSteps = [
  { id: "personal", label: "Personal Information", completed: true, required: true },
  { id: "contact", label: "Contact Details", completed: true, required: true },
  { id: "academic", label: "Academic Information", completed: true, required: true },
  { id: "skills", label: "Skills & Certifications", completed: false, required: true },
  { id: "documents", label: "Documents", completed: false, required: false },
  { id: "social", label: "Social Profiles", completed: false, required: false }
];
