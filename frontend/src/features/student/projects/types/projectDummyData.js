/**
 * Shared Dummy Data for Pragati Projects Module
 * Single Source of Truth for mock data across all hooks and components.
 */

export const mockProjects = [
  {
    id: "proj-101",
    title: "AI-Powered Smart Campus Navigation System",
    description: "An interactive web and mobile application utilizing indoor mapping algorithms, BLE beacons, and AR pathfinding to assist new students, visitors, and accessibility-impaired users across campus buildings.",
    category: "Web & Mobile Development",
    status: "IN_PROGRESS",
    progressPercent: 68,
    startDate: "2026-06-01",
    dueDate: "2026-08-30",
    tags: ["React", "TailwindCSS", "Node.js", "Computer Vision", "AR"],
    mentor: {
      id: "m-01",
      name: "Dr. Ananya Sharma",
      role: "Associate Professor, CSE",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      email: "ananya.sharma@uptoskills.com"
    },
    members: [
      {
        id: "usr-01",
        name: "Rahul Verma",
        role: "Team Lead & Fullstack Dev",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isOwner: true
      },
      {
        id: "usr-02",
        name: "Priya Patel",
        role: "UI/UX & Frontend Developer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        isOwner: false
      },
      {
        id: "usr-03",
        name: "Aman Gupta",
        role: "Backend & Systems Architect",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        isOwner: false
      }
    ],
    githubRepo: {
      url: "https://github.com/pragati-org/smart-campus-nav",
      branch: "main",
      lastCommit: "fa8291c - Fix pathfinding node graph latency",
      updatedAt: "2026-08-05T14:32:00Z"
    }
  },
  {
    id: "proj-102",
    title: "Distributed Microservices E-Commerce Pipeline",
    description: "Cloud-native microservices architecture for high-throughput order processing with Kafka event streams, Redis caching, and real-time inventory synchronization.",
    category: "Cloud & DevOps",
    status: "UNDER_REVIEW",
    progressPercent: 92,
    startDate: "2026-05-15",
    dueDate: "2026-08-15",
    tags: ["Spring Boot", "Kafka", "Docker", "Kubernetes", "Redis"],
    mentor: {
      id: "m-02",
      name: "Prof. Rajesh Kumar",
      role: "Industry Mentor - Cloud Lead",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      email: "rajesh.k@uptoskills.com"
    },
    members: [
      {
        id: "usr-01",
        name: "Rahul Verma",
        role: "Backend Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isOwner: false
      },
      {
        id: "usr-04",
        name: "Neha Mehta",
        role: "DevOps Engineer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        isOwner: true
      }
    ],
    githubRepo: {
      url: "https://github.com/pragati-org/distributed-ecom-pipeline",
      branch: "develop",
      lastCommit: "b91122a - Deploy helm charts to staging cluster",
      updatedAt: "2026-08-04T10:15:00Z"
    }
  },
  {
    id: "proj-103",
    title: "Healthcare Telemedicine Patient Analytics",
    description: "Secure, HIPAA-compliant patient vital tracking dashboard with automated ECG anomaly detection using lightweight machine learning models.",
    category: "Data Science & AI",
    status: "COMPLETED",
    progressPercent: 100,
    startDate: "2026-04-01",
    dueDate: "2026-07-25",
    tags: ["Python", "FastAPI", "TensorFlow", "React", "PostgreSQL"],
    mentor: {
      id: "m-03",
      name: "Dr. Sunita Rao",
      role: "Healthcare AI Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
      email: "sunita.rao@uptoskills.com"
    },
    members: [
      {
        id: "usr-01",
        name: "Rahul Verma",
        role: "Data Analyst",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isOwner: true
      }
    ],
    githubRepo: {
      url: "https://github.com/pragati-org/telemed-patient-analytics",
      branch: "main",
      lastCommit: "90ce331 - Add final model evaluation metrics document",
      updatedAt: "2026-07-24T18:00:00Z"
    }
  },
  {
    id: "proj-104",
    title: "Automated Code Review Assistant (LLM Integration)",
    description: "VS Code extension and GitHub Action bot that provides automated security vulnerability scans and performance suggestions using Fine-Tuned Llama models.",
    category: "Developer Tools",
    status: "NOT_STARTED",
    progressPercent: 0,
    startDate: "2026-08-10",
    dueDate: "2026-10-30",
    tags: ["TypeScript", "Python", "LangChain", "Ollama", "VS Code API"],
    mentor: {
      id: "m-01",
      name: "Dr. Ananya Sharma",
      role: "Associate Professor, CSE",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      email: "ananya.sharma@uptoskills.com"
    },
    members: [
      {
        id: "usr-01",
        name: "Rahul Verma",
        role: "Lead Developer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isOwner: true
      }
    ],
    githubRepo: {
      url: "https://github.com/pragati-org/llm-code-reviewer",
      branch: "main",
      lastCommit: "11a009e - Initial commit & scaffolding",
      updatedAt: "2026-08-01T09:00:00Z"
    }
  }
];

export const mockMilestones = [
  {
    id: "ms-1",
    projectId: "proj-101",
    title: "Phase 1: Architecture & UI Prototype",
    description: "Finalize system architecture design, database schema, and high-fidelity Figma prototypes for mobile and web screens.",
    dueDate: "2026-06-25",
    status: "COMPLETED",
    progressPercent: 100,
    tasks: [
      {
        id: "tsk-101",
        title: "Create System Architecture Diagram",
        description: "Map out frontend, backend, BLE scanner integration, and database data flow.",
        status: "COMPLETED",
        assignee: {
          name: "Aman Gupta",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-06-10",
        checklist: [
          { id: "c-1", text: "Draft component flow diagram", completed: true },
          { id: "c-2", text: "Verify database relationships", completed: true },
          { id: "c-3", text: "Review architecture with mentor", completed: true }
        ]
      },
      {
        id: "tsk-102",
        title: "Figma High-Fidelity Mockups",
        description: "Design accessible mobile viewports with high contrast dark/light themes.",
        status: "COMPLETED",
        assignee: {
          name: "Priya Patel",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-06-20",
        checklist: [
          { id: "c-4", text: "Map screen UI", completed: true },
          { id: "c-5", text: "Create interactive prototype link", completed: true }
        ]
      }
    ]
  },
  {
    id: "ms-2",
    projectId: "proj-101",
    title: "Phase 2: Core Indoor Pathfinding & BLE Beacon Setup",
    description: "Implement Dijkstra/A* shortest path navigation algorithms over campus node graphs and integrate simulated BLE signal triangulation.",
    dueDate: "2026-07-20",
    status: "IN_PROGRESS",
    progressPercent: 75,
    tasks: [
      {
        id: "tsk-103",
        title: "Pathfinding Algorithm Optimization",
        description: "Reduce node graph resolution processing time under 50ms for complex building floors.",
        status: "COMPLETED",
        assignee: {
          name: "Rahul Verma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-07-10",
        checklist: [
          { id: "c-6", text: "Implement A* algorithm in Node backend", completed: true },
          { id: "c-7", text: "Benchmark multi-floor staircase transitions", completed: true }
        ]
      },
      {
        id: "tsk-104",
        title: "BLE Triangulation Simulator API",
        description: "Construct mock WebSocket service emitting rssi values for indoor location calculation.",
        status: "IN_PROGRESS",
        assignee: {
          name: "Aman Gupta",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-07-18",
        checklist: [
          { id: "c-8", text: "Create mock WebSocket server", completed: true },
          { id: "c-9", text: "Test location jitter filter", completed: false }
        ]
      }
    ]
  },
  {
    id: "ms-3",
    projectId: "proj-101",
    title: "Phase 3: Frontend Integration & Live Testing",
    description: "Wire frontend views with live location updates, complete student submission bundle, and perform user field testing.",
    dueDate: "2026-08-25",
    status: "NOT_STARTED",
    progressPercent: 20,
    tasks: [
      {
        id: "tsk-105",
        title: "AR Canvas Overlay Implementation",
        description: "Integrate WebXR/Three.js camera directional arrows on mobile viewports.",
        status: "IN_PROGRESS",
        assignee: {
          name: "Priya Patel",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-08-15",
        checklist: [
          { id: "c-10", text: "Render 3D direction vector", completed: true },
          { id: "c-11", text: "Calibrate camera gyro sensor", completed: false }
        ]
      },
      {
        id: "tsk-106",
        title: "Final Security Audit & Documentation",
        description: "Generate user guides, API docs, and run OWASP security scanner on endpoints.",
        status: "NOT_STARTED",
        assignee: {
          name: "Rahul Verma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        dueDate: "2026-08-22",
        checklist: [
          { id: "c-12", text: "Compile PDF Documentation", completed: false },
          { id: "c-13", text: "Run NPM vulnerability audit", completed: false }
        ]
      }
    ]
  }
];

export const mockSubmissions = [
  {
    id: "sub-201",
    projectId: "proj-101",
    title: "Mid-Term Sprint Milestone Submission",
    notes: "Includes Phase 1 and Phase 2 completed code, Figma designs, and live prototype demonstration video link. Backend WebSocket server is ready for deployment.",
    submittedBy: {
      name: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    submittedAt: "2026-08-04T16:45:00Z",
    status: "UNDER_REVIEW",
    githubRepoUrl: "https://github.com/pragati-org/smart-campus-nav",
    githubBranch: "main",
    commitHash: "fa8291c900e",
    uploadedFiles: [
      {
        id: "f-1",
        name: "SmartCampus_Architecture_Doc_v2.pdf",
        size: 3450000, // 3.45 MB
        type: "application/pdf",
        uploadedAt: "2026-08-04T16:30:00Z",
        url: "#"
      },
      {
        id: "f-2",
        name: "Indoor_Pathfinding_Benchmark_Results.png",
        size: 890000, // 890 KB
        type: "image/png",
        uploadedAt: "2026-08-04T16:35:00Z",
        url: "#"
      },
      {
        id: "f-3",
        name: "Sprint2_Demo_Walkthrough.mp4",
        size: 18400000, // 18.4 MB
        type: "video/mp4",
        uploadedAt: "2026-08-04T16:42:00Z",
        url: "#"
      }
    ]
  },
  {
    id: "sub-200",
    projectId: "proj-101",
    title: "Initial Requirements & Setup Submission",
    notes: "Initial repository setup, baseline dependencies, and preliminary system design document submission.",
    submittedBy: {
      name: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    submittedAt: "2026-06-15T11:20:00Z",
    status: "APPROVED",
    githubRepoUrl: "https://github.com/pragati-org/smart-campus-nav",
    githubBranch: "main",
    commitHash: "109a82ff30b",
    uploadedFiles: [
      {
        id: "f-0",
        name: "Project_Proposal_Draft.pdf",
        size: 1200000,
        type: "application/pdf",
        uploadedAt: "2026-06-15T11:15:00Z",
        url: "#"
      }
    ]
  }
];

export const mockReviews = {
  projectId: "proj-101",
  overallScore: 88,
  grade: "A",
  status: "UNDER_REVIEW",
  evaluatedAt: "2026-08-05T10:15:00Z",
  rubricScores: [
    { category: "Code Quality & Clean Architecture", score: 92, maxScore: 100 },
    { category: "UI/UX Accessibility & Aesthetics", score: 85, maxScore: 100 },
    { category: "Performance & Pathfinding Speed", score: 90, maxScore: 100 },
    { category: "Documentation & Commit Hygiene", score: 85, maxScore: 100 }
  ],
  comments: [
    {
      id: "rev-c1",
      author: {
        name: "Dr. Ananya Sharma",
        role: "Mentor & Project Evaluator",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      },
      content: "Great progress on the Dijkstra node optimization! The latency under 50ms is very impressive. For Phase 3, make sure to add fallback handling when mobile device gyro sensors fluctuate outdoors.",
      timestamp: "2026-08-05T10:20:00Z",
      type: "MENTOR_FEEDBACK"
    },
    {
      id: "rev-c2",
      author: {
        name: "Rahul Verma",
        role: "Student Team Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      content: "Thank you Dr. Sharma! We are adding a Kalman filter smoothing step to handle gyro fluctuations in our next sprint.",
      timestamp: "2026-08-05T11:05:00Z",
      type: "STUDENT_REPLY"
    }
  ],
  timeline: [
    {
      id: "t-1",
      title: "Sprint 2 Submitted",
      description: "Mid-Term Sprint Bundle uploaded by Rahul Verma.",
      date: "2026-08-04T16:45:00Z",
      type: "SUBMISSION"
    },
    {
      id: "t-2",
      title: "Mentor Evaluation Initiated",
      description: "Dr. Ananya Sharma began code review and performance testing.",
      date: "2026-08-05T09:00:00Z",
      type: "REVIEW_START"
    },
    {
      id: "t-3",
      title: "Preliminary Grade Assigned",
      description: "Overall Score: 88/100 (Grade A) recorded.",
      date: "2026-08-05T10:15:00Z",
      type: "GRADE_ASSIGNED"
    }
  ]
};

export const mockAnalytics = {
  projectId: "proj-101",
  overview: {
    totalMilestones: 3,
    completedMilestones: 1,
    inProgressMilestones: 1,
    pendingMilestones: 1,
    totalTasks: 6,
    completedTasks: 4,
    inProgressTasks: 1,
    pendingTasks: 1,
    completionRate: 67,
    velocityScore: "High",
    commitsThisMonth: 34,
    hoursLogged: 128
  },
  progressOverTime: [
    { date: "Week 1", planned: 20, actual: 18 },
    { date: "Week 2", planned: 35, actual: 35 },
    { date: "Week 3", planned: 50, actual: 48 },
    { date: "Week 4", planned: 65, actual: 68 },
    { date: "Week 5", planned: 80, actual: 75 },
    { date: "Week 6 (Est)", planned: 100, actual: 92 }
  ],
  taskDistribution: [
    { name: "Completed", value: 4, color: "#10b981" },
    { name: "In Progress", value: 1, color: "#0ea5e9" },
    { name: "Not Started", value: 1, color: "#94a3b8" }
  ],
  activityTimeline: [
    {
      id: "act-1",
      user: "Rahul Verma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      action: "Pushed commit to main branch",
      details: "fa8291c - Fix pathfinding node graph latency",
      timestamp: "2026-08-05T14:32:00Z"
    },
    {
      id: "act-2",
      user: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      action: "Updated checklist on Task #tsk-105",
      details: "Render 3D direction vector completed",
      timestamp: "2026-08-05T12:15:00Z"
    },
    {
      id: "act-3",
      user: "Dr. Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      action: "Posted Mentor Review Comment",
      details: "Score assigned: 88/100",
      timestamp: "2026-08-05T10:20:00Z"
    },
    {
      id: "act-4",
      user: "Aman Gupta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      action: "Created task #tsk-104",
      details: "BLE Triangulation Simulator API",
      timestamp: "2026-08-03T09:40:00Z"
    }
  ],
  performanceSummary: {
    strengths: [
      "Consistent commit cadence across all team members.",
      "High test coverage on pathfinding algorithms.",
      "Prompt responses to mentor feedback."
    ],
    improvements: [
      "Increase test coverage on mobile gyro hardware integration.",
      "Ensure document updates match newly introduced API endpoints."
    ],
    overallStatus: "On Track for On-Time Completion"
  }
};
