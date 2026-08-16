// src/features/student/placement/types/placementDummyData.js
// ⚠️  RESERVED FILE — Owned exclusively by @team-lead.
//     DO NOT modify directly. Submit changes via _review/ draft and flag for review.
//
// Purpose: Single source of offline/mock data for the placement module.
//          This file is imported ONLY by placementService.js when VITE_USE_MOCK=true.

// ─── Constants (inlined to avoid circular import with constants file) ─────────
const APPLICATION_STATUS = {
  APPLIED:     'Applied',
  SHORTLISTED: 'Shortlisted',
  ASSESSMENT:  'Assessment',
  INTERVIEW:   'Interview',
  SELECTED:    'Selected',
  REJECTED:    'Rejected',
  WITHDRAWN:   'Withdrawn',
};

const JOB_TYPE = {
  FULL_TIME:  'Full-Time',
  PART_TIME:  'Part-Time',
  INTERNSHIP: 'Internship',
  CONTRACT:   'Contract',
  REMOTE:     'Remote',
};

const RESUME_STATUS = {
  APPROVED:     'Approved',
  NEEDS_UPDATE: 'Needs Update',
  UPLOADED:     'Uploaded',
  UNDER_REVIEW: 'Under Review',
  NOT_UPLOADED: 'Not Uploaded',
};

const PROFILE_SECTION = {
  BASIC_INFO:     'basic_info',
  EDUCATION:      'education',
  SKILLS:         'skills',
  CERTIFICATIONS: 'certifications',
  PROJECTS:       'projects',
  INTERNSHIPS:    'internships',
  PREFERENCES:    'preferences',
  RESUME:         'resume',
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const dummyProfile = {
  studentId: 'STU-2024-001',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@pragati.edu',
  phone: '+91 98765 43210',
  avatar: null,
  rollNumber: 'CS2021042',
  department: 'Computer Science & Engineering',
  batch: '2021–2025',
  cgpa: 8.4,
  tenthPercent: 92.5,
  twelfthPercent: 88.0,
  college: 'Pragati Institute of Technology',
  city: 'Bangalore',
  state: 'Karnataka',
  linkedIn: 'https://linkedin.com/in/arjun-mehta',
  github: 'https://github.com/arjunmehta',
  portfolio: 'https://arjunmehta.dev',
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Pragati Institute of Technology',
      startYear: 2021,
      endYear: 2025,
      cgpa: 8.4,
      current: true,
    },
    {
      id: 'edu-2',
      degree: 'Class XII (CBSE)',
      institution: 'Delhi Public School',
      startYear: 2019,
      endYear: 2021,
      percentage: 88.0,
      current: false,
    },
  ],
  skills: [
    { id: 'sk-1', name: 'JavaScript',    level: 'Advanced',     endorsed: true  },
    { id: 'sk-2', name: 'React',          level: 'Advanced',     endorsed: true  },
    { id: 'sk-3', name: 'Node.js',        level: 'Intermediate', endorsed: false },
    { id: 'sk-4', name: 'Python',         level: 'Intermediate', endorsed: false },
    { id: 'sk-5', name: 'PostgreSQL',     level: 'Intermediate', endorsed: false },
    { id: 'sk-6', name: 'Docker',         level: 'Beginner',     endorsed: false },
    { id: 'sk-7', name: 'System Design',  level: 'Beginner',     endorsed: false },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issuedDate: '2024-03-15',
      expiryDate: '2027-03-15',
      credentialUrl: 'https://aws.amazon.com/verification/CERT-123',
    },
    {
      id: 'cert-2',
      title: 'Meta Front-End Developer Certificate',
      issuer: 'Meta / Coursera',
      issuedDate: '2023-11-20',
      expiryDate: null,
      credentialUrl: 'https://coursera.org/verify/CERT-456',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'SmartAttend — AI Attendance System',
      description: 'Facial-recognition attendance system built with Python, OpenCV, and React. Reduced manual attendance time by 90%.',
      techStack: ['Python', 'OpenCV', 'React', 'FastAPI', 'PostgreSQL'],
      startDate: '2024-01-01',
      endDate: '2024-04-30',
      githubUrl: 'https://github.com/arjunmehta/smart-attend',
      liveUrl: null,
    },
    {
      id: 'proj-2',
      title: 'EcoTrack — Carbon Footprint Tracker',
      description: 'Full-stack web app to track and visualize personal carbon footprint.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
      startDate: '2023-08-01',
      endDate: '2023-12-15',
      githubUrl: 'https://github.com/arjunmehta/ecotrack',
      liveUrl: 'https://ecotrack.vercel.app',
    },
  ],
  internships: [
    {
      id: 'int-1',
      company: 'Infosys',
      role: 'Frontend Developer Intern',
      startDate: '2024-05-01',
      endDate: '2024-07-31',
      description: 'Built and optimized React components for the internal HR portal. Improved Lighthouse score from 62 to 91.',
      location: 'Bangalore, IN',
      current: false,
    },
  ],
  preferences: {
    roles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
    locations: ['Bangalore', 'Hyderabad', 'Remote'],
    jobTypes: [JOB_TYPE.FULL_TIME, JOB_TYPE.REMOTE],
    expectedCTC: '8–12 LPA',
    noticePeriod: 'Immediate',
    openToRelocation: true,
  },
  resume: {
    status: RESUME_STATUS.APPROVED,
    uploadedAt: '2024-11-01T10:30:00Z',
    reviewedAt: '2024-11-03T14:00:00Z',
    score: 82,
    fileName: 'Arjun_Mehta_Resume_2024.pdf',
    fileUrl: '/resumes/arjun-mehta-2024.pdf',
    feedback: 'Strong project descriptions. Add quantified impact for internship section.',
  },
  completionPercentage: 78,
  incompleteSections: [PROFILE_SECTION.CERTIFICATIONS, PROFILE_SECTION.PREFERENCES],
};

// ─── Dashboard Overview ───────────────────────────────────────────────────────
export const dummyPlacementOverview = {
  studentId: 'STU-2024-001',
  overallReadinessScore: 72,
  profileCompletion: 78,
  resumeScore: 82,
  placementStatus: 'In Progress',
  totalApplications: 14,
  shortlisted: 5,
  interviews: 3,
  offers: 0,
  lastUpdated: '2026-08-13T18:00:00Z',
};

// ─── Skill Readiness ──────────────────────────────────────────────────────────
export const dummySkillReadiness = {
  overallSkillScore: 68,
  skills: [
    { id: 'sk-1', name: 'JavaScript',   currentScore: 82, targetScore: 90, progress: 91, category: 'Core' },
    { id: 'sk-2', name: 'React',         currentScore: 78, targetScore: 85, progress: 92, category: 'Core' },
    { id: 'sk-3', name: 'Node.js',       currentScore: 60, targetScore: 80, progress: 75, category: 'Backend' },
    { id: 'sk-4', name: 'Python',        currentScore: 55, targetScore: 75, progress: 73, category: 'Backend' },
    { id: 'sk-5', name: 'PostgreSQL',    currentScore: 50, targetScore: 70, progress: 71, category: 'Database' },
    { id: 'sk-6', name: 'Docker',        currentScore: 30, targetScore: 60, progress: 50, category: 'DevOps' },
    { id: 'sk-7', name: 'System Design', currentScore: 25, targetScore: 70, progress: 36, category: 'Architecture' },
    { id: 'sk-8', name: 'DSA',           currentScore: 65, targetScore: 85, progress: 76, category: 'Core' },
  ],
  skillGapAnalysis: [
    { skillId: 'sk-7', skillName: 'System Design', currentScore: 25, targetScore: 70, gap: 45, priority: 'High',   reason: 'Required for senior engineering roles in your preference list.' },
    { skillId: 'sk-6', skillName: 'Docker',         currentScore: 30, targetScore: 60, gap: 30, priority: 'High',   reason: 'Most shortlisted companies require containerization skills.' },
    { skillId: 'sk-3', skillName: 'Node.js',        currentScore: 60, targetScore: 80, gap: 20, priority: 'Medium', reason: 'Completes your full-stack profile for MERN roles.' },
  ],
  recommendedSkills: [
    { id: 'rs-1', name: 'TypeScript', reason: 'Demanded by 68% of your target companies.',        resourceUrl: 'https://www.typescriptlang.org/docs/' },
    { id: 'rs-2', name: 'Redis',      reason: 'Common backend caching skill for scale-up roles.', resourceUrl: 'https://redis.io/learn' },
    { id: 'rs-3', name: 'GraphQL',    reason: 'Growing demand in modern API development.',        resourceUrl: 'https://graphql.org/learn/' },
  ],
};

// ─── Assessment Performance ───────────────────────────────────────────────────
export const dummyAssessments = {
  overallAssessmentScore: 74,
  categories: [
    {
      type: 'Aptitude',
      label: 'Aptitude',
      latestScore: 78,
      average: 74,
      attempts: 3,
      lastAttemptDate: '2026-07-28',
      breakdown: { quantitative: 80, logical: 76, verbal: 72 },
    },
    {
      type: 'Technical',
      label: 'Technical',
      latestScore: 72,
      average: 69,
      attempts: 4,
      lastAttemptDate: '2026-08-05',
      breakdown: { dataStructures: 75, algorithms: 70, databases: 68, os: 65 },
    },
    {
      type: 'Coding',
      label: 'Coding',
      latestScore: 80,
      average: 76,
      attempts: 6,
      lastAttemptDate: '2026-08-10',
      breakdown: { easy: 90, medium: 72, hard: 48 },
    },
    {
      type: 'Communication',
      label: 'Communication',
      latestScore: 68,
      average: 65,
      attempts: 2,
      lastAttemptDate: '2026-07-15',
      breakdown: { verbal: 70, written: 66 },
    },
  ],
  weeklyTrend: [
    { week: 'Jun W1', aptitude: 65, technical: 60, coding: 68, communication: 62 },
    { week: 'Jun W3', aptitude: 68, technical: 62, coding: 70, communication: 63 },
    { week: 'Jul W1', aptitude: 72, technical: 65, coding: 74, communication: 64 },
    { week: 'Jul W2', aptitude: 74, technical: 68, coding: 76, communication: 65 },
    { week: 'Jul W3', aptitude: 75, technical: 69, coding: 78, communication: 65 },
    { week: 'Jul W4', aptitude: 76, technical: 70, coding: 79, communication: 66 },
    { week: 'Aug W1', aptitude: 78, technical: 72, coding: 80, communication: 68 },
  ],
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const dummyApplications = {
  total: 14,
  page: 1,
  pageSize: 10,
  totalPages: 2,
  applications: [
    {
      applicationId: 'APP-001',
      company: 'Flipkart',
      companyLogo: null,
      jobTitle: 'Software Development Engineer I',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '18–22 LPA',
      appliedDate: '2026-07-15',
      status: APPLICATION_STATUS.INTERVIEW,
      interviewDate: '2026-08-20T10:00:00Z',
      jobDescription: 'Build and scale commerce features for 500M+ users.',
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED,     date: '2026-07-15T09:00:00Z', note: 'Application submitted.' },
        { stage: APPLICATION_STATUS.SHORTLISTED, date: '2026-07-22T14:00:00Z', note: 'Profile shortlisted by recruiter.' },
        { stage: APPLICATION_STATUS.ASSESSMENT,  date: '2026-07-28T11:00:00Z', note: 'Online coding assessment completed. Score: 78/100.' },
        { stage: APPLICATION_STATUS.INTERVIEW,   date: '2026-08-05T10:00:00Z', note: 'Technical interview round 1 scheduled.' },
      ],
    },
    {
      applicationId: 'APP-002',
      company: 'Razorpay',
      companyLogo: null,
      jobTitle: 'Frontend Engineer',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '15–20 LPA',
      appliedDate: '2026-07-18',
      status: APPLICATION_STATUS.SHORTLISTED,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED,     date: '2026-07-18T10:00:00Z', note: 'Application submitted.' },
        { stage: APPLICATION_STATUS.SHORTLISTED, date: '2026-07-25T16:00:00Z', note: 'Profile shortlisted.' },
      ],
    },
    {
      applicationId: 'APP-003',
      company: 'Ola',
      companyLogo: null,
      jobTitle: 'Full Stack Developer',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '12–18 LPA',
      appliedDate: '2026-07-10',
      status: APPLICATION_STATUS.REJECTED,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED,  date: '2026-07-10T09:00:00Z', note: 'Application submitted.' },
        { stage: APPLICATION_STATUS.REJECTED, date: '2026-07-20T11:00:00Z', note: 'Not progressed.' },
      ],
    },
    {
      applicationId: 'APP-004',
      company: 'CRED',
      companyLogo: null,
      jobTitle: 'Software Engineer — Frontend',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '20–28 LPA',
      appliedDate: '2026-07-22',
      status: APPLICATION_STATUS.ASSESSMENT,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED,     date: '2026-07-22T08:00:00Z', note: 'Application submitted.' },
        { stage: APPLICATION_STATUS.SHORTLISTED, date: '2026-07-29T15:00:00Z', note: 'Profile shortlisted.' },
        { stage: APPLICATION_STATUS.ASSESSMENT,  date: '2026-08-05T09:00:00Z', note: 'Online assessment link sent.' },
      ],
    },
    {
      applicationId: 'APP-005',
      company: 'Swiggy',
      companyLogo: null,
      jobTitle: 'SDE-1 (React)',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '14–18 LPA',
      appliedDate: '2026-06-30',
      status: APPLICATION_STATUS.APPLIED,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED, date: '2026-06-30T10:00:00Z', note: 'Application submitted.' },
      ],
    },
    {
      applicationId: 'APP-006',
      company: 'Zepto',
      companyLogo: null,
      jobTitle: 'Software Engineer',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Mumbai, IN',
      ctc: '16–20 LPA',
      appliedDate: '2026-08-01',
      status: APPLICATION_STATUS.APPLIED,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED, date: '2026-08-01T09:00:00Z', note: 'Application submitted.' },
      ],
    },
    {
      applicationId: 'APP-007',
      company: 'PhonePe',
      companyLogo: null,
      jobTitle: 'Associate SDE',
      jobType: JOB_TYPE.FULL_TIME,
      location: 'Bangalore, IN',
      ctc: '12–15 LPA',
      appliedDate: '2026-07-05',
      status: APPLICATION_STATUS.WITHDRAWN,
      interviewDate: null,
      timeline: [
        { stage: APPLICATION_STATUS.APPLIED,   date: '2026-07-05T09:00:00Z', note: 'Application submitted.' },
        { stage: APPLICATION_STATUS.WITHDRAWN, date: '2026-07-12T10:00:00Z', note: 'Candidate withdrew application.' },
      ],
    },
  ],
};

// ─── Readiness Report ─────────────────────────────────────────────────────────
export const dummyReadinessReport = {
  overallScore: 72,
  generatedAt: '2026-08-13T18:00:00Z',
  categories: [
    { category: 'Academic Performance', score: 84, weight: 0.20, trend: 'stable'    },
    { category: 'Technical Skills',     score: 68, weight: 0.30, trend: 'improving' },
    { category: 'Assessment Scores',    score: 74, weight: 0.25, trend: 'improving' },
    { category: 'Profile Completeness', score: 78, weight: 0.10, trend: 'stable'    },
    { category: 'Communication',        score: 65, weight: 0.10, trend: 'stable'    },
    { category: 'Experience',           score: 55, weight: 0.05, trend: 'improving' },
  ],
  improvementAreas: [
    {
      id: 'ia-1',
      area: 'System Design',
      currentScore: 25,
      targetScore: 70,
      priority: 'High',
      actions: [
        'Complete HLD/LLD course on NPTEL',
        'Practice on Excalidraw',
        'Study Grokking the System Design Interview',
      ],
    },
    {
      id: 'ia-2',
      area: 'Docker & Containerization',
      currentScore: 30,
      targetScore: 60,
      priority: 'High',
      actions: [
        'Complete Docker official getting-started guide',
        'Containerize the SmartAttend project',
      ],
    },
    {
      id: 'ia-3',
      area: 'Communication Skills',
      currentScore: 65,
      targetScore: 80,
      priority: 'Medium',
      actions: [
        'Practice mock GDs with peers',
        'Take Toastmasters sessions via college club',
      ],
    },
  ],
};

// ─── Career Recommendations ───────────────────────────────────────────────────
export const dummyRecommendations = [
  {
    id: 'rec-1',
    priority: 'High',
    title: 'Strengthen System Design Knowledge',
    description: 'Your system design score (25%) is significantly below the benchmark (70%) for SDE-1 roles.',
    reason: 'Flipkart, CRED, and Razorpay include system design rounds even for freshers.',
    action: 'Complete the HLD course on NPTEL and practice 2 design problems per week.',
    category: 'Skills',
    estimatedImpact: '+12 readiness points',
  },
  {
    id: 'rec-2',
    priority: 'High',
    title: 'Learn Docker & Containerization',
    description: '78% of shortlisted companies list Docker in their JD. Your current score is 30%.',
    reason: 'Modern backend and DevOps roles require containerization as a baseline.',
    action: 'Spend 1 week on the official Docker getting started track, then containerize an existing project.',
    category: 'Skills',
    estimatedImpact: '+8 readiness points',
  },
  {
    id: 'rec-3',
    priority: 'Medium',
    title: 'Complete Your Profile (Resume & Preferences)',
    description: 'Profile is 78% complete. Missing certifications and preferences.',
    reason: 'Placement coordinators filter incomplete profiles before shortlisting for campus drives.',
    action: 'Upload at least 1 more certification and complete your career preferences.',
    category: 'Profile',
    estimatedImpact: '+5 readiness points',
  },
  {
    id: 'rec-4',
    priority: 'Medium',
    title: 'Attempt 2 More Communication Assessments',
    description: 'Communication score (65%) is below threshold (70%) for client-facing SDE roles.',
    reason: 'Razorpay and Swiggy conduct HR/communication rounds before final selection.',
    action: 'Attend the next 2 mock GD sessions arranged by the TPO.',
    category: 'Assessments',
    estimatedImpact: '+4 readiness points',
  },
  {
    id: 'rec-5',
    priority: 'Low',
    title: 'Add TypeScript to Your Skill Set',
    description: '68% of target companies prefer TypeScript over plain JavaScript.',
    reason: 'TypeScript unlocks more senior roles at Flipkart, CRED, and Zepto.',
    action: 'Complete the TypeScript Handbook (free) in 3 days, then migrate SmartAttend frontend.',
    category: 'Skills',
    estimatedImpact: '+3 readiness points',
  },
];
