// profileDummyData.js
// Shared dummy data — used until real API is ready
// src/features/student/profile/types/profileDummyData.js

export const profileOverview = {
  name: "John Doe",
  headline: "Full Stack Developer",
  email: "johndoe@college.edu",
  phone: "9876543210",
  city: "Pune",
  department: "Computer Engineering",
  cgpa: 8.7,
  rollNo: "2021CE047",
  batch: "2021-2025",
  status: "eligible",
};

export const resumeData = {
  filename: "resume.pdf",
  uploadedAt: "June 2026",
  url: null,
};

export const portfolioData = {
  github: "",
  linkedin: "",
  website: "",
};

export const skillsData = [
  "Java",
  "React",
  "Node.js",
  "PostgreSQL",
];

export const projectsData = [
  {
    title: "Placement Portal",
    description: "Student placement system",
    techStack: ["React", "Node.js"],
    link: "",
  },
];

export const socialLinksData = {
  github: "",
  linkedin: "",
  leetcode: "",
  codeforces: "",
};

export const profileApiResponse = {
  success: true,
  data: {
    overview: profileOverview,
    resume: resumeData,
    portfolio: portfolioData,
    skills: skillsData,
    projects: projectsData,
    socialLinks: socialLinksData,
  },
};
