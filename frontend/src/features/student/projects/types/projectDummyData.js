/**
 * Single Source of Truth for Student Projects Dummy Data
 */

export const dummyProjects = [
  {
    id: 'proj-101',
    title: 'AI Smart Learning Dashboard',
    subtitle: 'Interactive analytics and personalized AI-driven study recommendation engine',
    description: 'Build a full-stack student analytics portal that consumes real-time telemetry from learning sessions, processes study habits using Machine Learning models, and delivers dynamic study cards, adaptive quizzes, and performance trend visualizations.',
    status: 'in-progress',
    category: 'Web & AI',
    course: 'CS-402 Advanced Web Engineering',
    startDate: '2026-05-10',
    dueDate: '2026-08-30',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL'],
    githubRepoUrl: 'https://github.com/uptoskills-students/ai-learning-dashboard',
    teamMembers: [
      { id: 'u-1', name: 'Musthafa Ahmed', role: 'Team Lead & Frontend', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'u-2', name: 'Aarav Sharma', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { id: 'u-3', name: 'Priya Patel', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    mentor: {
      name: 'Dr. Bhavya Chawda',
      title: 'Senior Associate Professor',
      email: 'bhavya.c@uptoskills.com'
    }
  },
  {
    id: 'proj-102',
    title: 'E-Commerce Microservices Platform',
    subtitle: 'Scalable distributed e-commerce architecture with payment gateway integration',
    description: 'Designed and implemented an event-driven microservices architecture using Node.js, RabbitMQ, and Docker. Features order management, inventory synchronization, real-time cart handling, and Stripe gateway sandbox integration.',
    status: 'completed',
    category: 'Cloud & Distributed Systems',
    course: 'CS-415 Enterprise Architecture',
    startDate: '2026-02-01',
    dueDate: '2026-05-15',
    techStack: ['Node.js', 'Express', 'Docker', 'RabbitMQ', 'MongoDB', 'Redis'],
    githubRepoUrl: 'https://github.com/uptoskills-students/ecommerce-microservices',
    teamMembers: [
      { id: 'u-1', name: 'Musthafa Ahmed', role: 'Full Stack Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'u-4', name: 'Neha Verma', role: 'DevOps & Cloud Specialist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    mentor: {
      name: 'Prof. Rajesh Kumar',
      title: 'Cloud Architect Lead',
      email: 'rajesh.k@uptoskills.com'
    }
  },
  {
    id: 'proj-103',
    title: 'Decentralized Identity Verification Vault',
    subtitle: 'Blockchain-backed verifiable credentials for academic degrees',
    description: 'A Web3 identity management app allowing university registrars to issue tamper-proof cryptographic degree certificates on Ethereum Sepolia testnet with zero-knowledge verification capabilities.',
    status: 'needs-revision',
    category: 'Blockchain & Security',
    course: 'CS-480 Web3 & Applied Cryptography',
    startDate: '2026-04-15',
    dueDate: '2026-07-20',
    techStack: ['Solidity', 'Ethers.js', 'React', 'IPFS', 'Hardhat'],
    githubRepoUrl: 'https://github.com/uptoskills-students/decentralized-id-vault',
    teamMembers: [
      { id: 'u-1', name: 'Musthafa Ahmed', role: 'Smart Contract Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'u-5', name: 'Rohan Gupta', role: 'Security Analyst', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    mentor: {
      name: 'Dr. Ananya Roy',
      title: 'Cybersecurity & Web3 Researcher',
      email: 'ananya.r@uptoskills.com'
    }
  },
  {
    id: 'proj-104',
    title: 'HealthTrack IoT Wearable Sync',
    subtitle: 'Real-time telemetry streaming from smartwatch sensors to medical provider dashboards',
    description: 'Integrated Bluetooth Low Energy (BLE) peripheral data parsing with WebSocket push channels to stream oxygen saturation, heart rate variability, and step metrics with sub-second latency.',
    status: 'under-review',
    category: 'Mobile & IoT',
    course: 'CS-462 Mobile Embedded Computing',
    startDate: '2026-03-01',
    dueDate: '2026-06-30',
    techStack: ['React Native', 'TypeScript', 'WebSockets', 'Python', 'InfluxDB'],
    githubRepoUrl: 'https://github.com/uptoskills-students/healthtrack-iot-sync',
    teamMembers: [
      { id: 'u-1', name: 'Musthafa Ahmed', role: 'Mobile Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    mentor: {
      name: 'Dr. Vikram Singh',
      title: 'Head of Embedded Systems',
      email: 'vikram.s@uptoskills.com'
    }
  },
  {
    id: 'proj-105',
    title: 'Autonomous Drone Navigation Simulator',
    subtitle: 'Computer vision path planning and obstacle avoidance in Unity environment',
    description: 'Simulates quadcopter flight dynamics through procedural urban environments using ROS2 bridge nodes, Deep Q-Learning path planners, and YOLOv8 real-time object identification.',
    status: 'overdue',
    category: 'Robotics & AI',
    course: 'CS-499 Autonomous Systems Senior Thesis',
    startDate: '2026-01-10',
    dueDate: '2026-06-15',
    techStack: ['Python', 'ROS2', 'PyTorch', 'Unity', 'OpenCV'],
    githubRepoUrl: 'https://github.com/uptoskills-students/drone-nav-simulator',
    teamMembers: [
      { id: 'u-1', name: 'Musthafa Ahmed', role: 'AI Specialist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 'u-6', name: 'Kavita Nair', role: 'Robotics Engineer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' }
    ],
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
    mentor: {
      name: 'Dr. Bhavya Chawda',
      title: 'Senior Associate Professor',
      email: 'bhavya.c@uptoskills.com'
    }
  }
];

export const dummyMilestones = {
  'proj-101': [
    {
      id: 'ms-101-1',
      title: 'Milestone 1: Architectural Design & Wireframing',
      description: 'Define database schema, system architecture diagram, and Figma component system.',
      dueDate: '2026-06-01',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-1', title: 'Draft ER diagram and PostgreSQL relational schemas', status: 'done', assignee: 'Aarav Sharma' },
        { id: 'task-2', title: 'Design high-fidelity Tailwind Figma mockups', status: 'done', assignee: 'Priya Patel' },
        { id: 'task-3', title: 'Configure Vite React repository structure & aliases', status: 'done', assignee: 'Musthafa Ahmed' }
      ]
    },
    {
      id: 'ms-101-2',
      title: 'Milestone 2: Core Frontend & State Management',
      description: 'Implement responsive dashboard components, React Router navigation, and custom hooks.',
      dueDate: '2026-07-15',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-4', title: 'Build Project Listing & Details pages layout', status: 'done', assignee: 'Musthafa Ahmed' },
        { id: 'task-5', title: 'Integrate Recharts progress & analytics charts', status: 'done', assignee: 'Musthafa Ahmed' },
        { id: 'task-6', title: 'Implement form validation and file dropzone', status: 'done', assignee: 'Musthafa Ahmed' }
      ]
    },
    {
      id: 'ms-101-3',
      title: 'Milestone 3: FastAPI Backend & ML Model Integration',
      description: 'Set up REST endpoints, JWT authentication, and connect Python recommendation model.',
      dueDate: '2026-08-10',
      status: 'in-progress',
      completionPercentage: 65,
      tasks: [
        { id: 'task-7', title: 'Expose FastAPI endpoints for project analytics', status: 'done', assignee: 'Aarav Sharma' },
        { id: 'task-8', title: 'Train scikit-learn recommendation algorithm', status: 'in-progress', assignee: 'Aarav Sharma' },
        { id: 'task-9', title: 'Connect frontend service layer to backend API endpoints', status: 'todo', assignee: 'Musthafa Ahmed' }
      ]
    },
    {
      id: 'ms-101-4',
      title: 'Milestone 4: End-to-End Testing & Final Submission',
      description: 'Conduct peer code reviews, load testing, performance tuning, and submit project dossier.',
      dueDate: '2026-08-30',
      status: 'todo',
      completionPercentage: 0,
      tasks: [
        { id: 'task-10', title: 'Run Cypress / React Testing Library automated tests', status: 'todo', assignee: 'Musthafa Ahmed' },
        { id: 'task-11', title: 'Record video demonstration and documentation writeup', status: 'todo', assignee: 'Priya Patel' },
        { id: 'task-12', title: 'Final deployment to Vercel/Render staging server', status: 'todo', assignee: 'Aarav Sharma' }
      ]
    }
  ],
  'proj-102': [
    {
      id: 'ms-102-1',
      title: 'Milestone 1: Microservices Skeleton & Docker Setup',
      description: 'Scaffold microservices, Docker compose files, and API Gateway routing.',
      dueDate: '2026-03-10',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-201', title: 'Create Docker compose environment for Redis, MongoDB & RabbitMQ', status: 'done', assignee: 'Neha Verma' },
        { id: 'task-202', title: 'Build Express API gateway service', status: 'done', assignee: 'Musthafa Ahmed' }
      ]
    },
    {
      id: 'ms-102-2',
      title: 'Milestone 2: Payments & Final Defense',
      description: 'Implement Stripe sandbox checkout webhooks and present architecture to committee.',
      dueDate: '2026-05-15',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-203', title: 'Integrate Stripe PaymentIntents API', status: 'done', assignee: 'Musthafa Ahmed' },
        { id: 'task-204', title: 'Pass final viva defense with 95/100 score', status: 'done', assignee: 'Neha Verma' }
      ]
    }
  ],
  'proj-103': [
    {
      id: 'ms-103-1',
      title: 'Milestone 1: Smart Contracts Audit & Gas Optimization',
      description: 'Deploy identity registry and degree issuer Solidity contracts on Sepolia testnet.',
      dueDate: '2026-05-30',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-301', title: 'Write Solidity ERC-721 credential smart contract', status: 'done', assignee: 'Musthafa Ahmed' }
      ]
    },
    {
      id: 'ms-103-2',
      title: 'Milestone 2: Security Revisions & Zero Knowledge Proofs',
      description: 'Fix reentrancy vulnerability flagged during mentor code review.',
      dueDate: '2026-07-20',
      status: 'in-progress',
      completionPercentage: 40,
      tasks: [
        { id: 'task-302', title: 'Implement OpenZeppelin ReentrancyGuard', status: 'in-progress', assignee: 'Musthafa Ahmed' },
        { id: 'task-303', title: 'Add SnarkJS ZK proof verifier', status: 'todo', assignee: 'Rohan Gupta' }
      ]
    }
  ],
  'proj-104': [
    {
      id: 'ms-104-1',
      title: 'Milestone 1: Bluetooth GATT Characteristic Parsing',
      description: 'Parse binary BLE packets from smartband hardware.',
      dueDate: '2026-04-15',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-401', title: 'Implement React Native BLE PLX profile reader', status: 'done', assignee: 'Musthafa Ahmed' }
      ]
    }
  ],
  'proj-105': [
    {
      id: 'ms-105-1',
      title: 'Milestone 1: Unity Flight Physics Engine',
      description: 'Set up ROS2 bridge and Unity simulator canvas.',
      dueDate: '2026-03-01',
      status: 'completed',
      completionPercentage: 100,
      tasks: [
        { id: 'task-501', title: 'Configure ROS2 TCP connector node', status: 'done', assignee: 'Kavita Nair' }
      ]
    },
    {
      id: 'ms-105-2',
      title: 'Milestone 2: Deep Q-Learning Obstacle Avoidance',
      description: 'Train autonomous quadcopter model to avoid obstacles in dense cityscape.',
      dueDate: '2026-06-15',
      status: 'overdue',
      completionPercentage: 30,
      tasks: [
        { id: 'task-502', title: 'Train PyTorch DDPG agent for 500,000 steps', status: 'in-progress', assignee: 'Musthafa Ahmed' },
        { id: 'task-503', title: 'Benchmark real-time frame rates in Unity', status: 'todo', assignee: 'Kavita Nair' }
      ]
    }
  ]
};

export const dummySubmissions = {
  'proj-101': [
    {
      id: 'sub-101-1',
      projectId: 'proj-101',
      version: 'v1.0-alpha',
      submittedAt: '2026-06-02T14:32:00Z',
      status: 'approved',
      title: 'Milestone 1 Deliverable — Architecture & Wireframes',
      notes: 'Initial architecture blueprint, database schemas, and responsive Figma design links.',
      githubRepoUrl: 'https://github.com/uptoskills-students/ai-learning-dashboard',
      commitHash: '7f3a9b2',
      files: [
        { name: 'Architecture_Blueprint_v1.pdf', size: 4850000, type: 'application/pdf', url: '#' },
        { name: 'Database_Schema_Diagram.png', size: 1240000, type: 'image/png', url: '#' }
      ]
    },
    {
      id: 'sub-101-2',
      projectId: 'proj-101',
      version: 'v2.0-beta',
      submittedAt: '2026-07-16T10:15:00Z',
      status: 'submitted',
      title: 'Milestone 2 Deliverable — Frontend Modules Implementation',
      notes: 'Complete React 18 + Tailwind frontend implementation with state management and interactive charts.',
      githubRepoUrl: 'https://github.com/uptoskills-students/ai-learning-dashboard/tree/feature/module-9',
      commitHash: 'e4901cf',
      files: [
        { name: 'Module9_Frontend_Source.zip', size: 18450000, type: 'application/zip', url: '#' },
        { name: 'Component_Documentation.pdf', size: 2300000, type: 'application/pdf', url: '#' }
      ]
    }
  ],
  'proj-103': [
    {
      id: 'sub-103-1',
      projectId: 'proj-103',
      version: 'v1.0',
      submittedAt: '2026-06-01T09:00:00Z',
      status: 'needs-revision',
      title: 'Initial Smart Contract Submission',
      notes: 'Solidity contracts deployed to Sepolia testnet.',
      githubRepoUrl: 'https://github.com/uptoskills-students/decentralized-id-vault',
      commitHash: '8b12c9a',
      files: [
        { name: 'SmartContract_Audit.pdf', size: 3100000, type: 'application/pdf', url: '#' }
      ]
    }
  ]
};

export const dummyFeedback = {
  'proj-101': {
    id: 'fb-101',
    projectId: 'proj-101',
    mentorName: 'Dr. Bhavya Chawda',
    mentorRole: 'Senior Associate Professor & Module Lead',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    reviewedAt: '2026-06-05T16:45:00Z',
    status: 'reviewed',
    overallScore: 92,
    rubricScores: [
      { category: 'Code Quality & Architecture', maxScore: 25, score: 24, comment: 'Clean separation of presentation, hooks, and services layer.' },
      { category: 'UI/UX & Design Precision', maxScore: 25, score: 23, comment: 'Sleek dark theme aesthetics, excellent responsiveness and micro-interactions.' },
      { category: 'Documentation & Git Standards', maxScore: 25, score: 22, comment: 'Git commits are clean. README needs minor setup step additions.' },
      { category: 'Technical Innovation & ML Integration', maxScore: 25, score: 23, comment: 'Solid integration plan for FastAPI recommendations engine.' }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Dr. Bhavya Chawda',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        timestamp: '2026-06-05T16:50:00Z',
        text: 'Outstanding progress on Milestone 1 & 2! The modular structure for student projects is exceptionally structured. Please make sure to validate file upload size limits on the frontend form before submitting Phase 3.'
      },
      {
        id: 'c-2',
        author: 'Musthafa Ahmed',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        timestamp: '2026-06-06T09:15:00Z',
        text: 'Thank you Dr. Bhavya! We have added client-side validation rules in projectValidation.js for file size and MIME types.'
      }
    ]
  },
  'proj-103': {
    id: 'fb-103',
    projectId: 'proj-103',
    mentorName: 'Dr. Ananya Roy',
    mentorRole: 'Cybersecurity Lead',
    mentorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    reviewedAt: '2026-06-10T11:20:00Z',
    status: 'needs-revision',
    overallScore: 68,
    rubricScores: [
      { category: 'Code Quality', maxScore: 25, score: 18, comment: 'Reentrancy vulnerability detected in degree claim function.' },
      { category: 'UI/UX', maxScore: 25, score: 18, comment: 'Web3 provider wallet connection error handling needs work.' }
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Dr. Ananya Roy',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        timestamp: '2026-06-10T11:25:00Z',
        text: 'Please apply OpenZeppelin ReentrancyGuard to credential issuance smart contract and resubmit.'
      }
    ]
  }
};

export const dummyAnalytics = {
  'proj-101': {
    projectId: 'proj-101',
    completionPercentage: 75,
    tasksCompleted: 9,
    totalTasks: 12,
    milestonesCompleted: 2,
    totalMilestones: 4,
    daysRemaining: 31,
    velocity: 4.5, // tasks per week
    weeklyProgress: [
      { week: 'Week 1', completed: 2, target: 2 },
      { week: 'Week 2', completed: 5, target: 4 },
      { week: 'Week 3', completed: 7, target: 6 },
      { week: 'Week 4', completed: 9, target: 8 },
      { week: 'Week 5 (Proj)', completed: 11, target: 10 },
      { week: 'Week 6 (Proj)', completed: 12, target: 12 }
    ],
    taskDistribution: [
      { name: 'Completed', value: 9, color: '#10b981' },
      { name: 'In Progress', value: 1, color: '#3b82f6' },
      { name: 'To Do', value: 2, color: '#64748b' }
    ],
    activityLog: [
      { id: 'act-1', date: '2026-07-29T14:20:00Z', user: 'Musthafa Ahmed', action: 'Uploaded file Module9_Frontend_Source.zip', icon: 'file' },
      { id: 'act-2', date: '2026-07-28T11:05:00Z', user: 'Musthafa Ahmed', action: 'Completed task: Integrate Recharts progress charts', icon: 'check-circle' },
      { id: 'act-3', date: '2026-07-25T16:40:00Z', user: 'Aarav Sharma', action: 'Updated status of FastAPI analytics endpoint to Done', icon: 'code' },
      { id: 'act-4', date: '2026-07-20T09:30:00Z', user: 'Priya Patel', action: 'Submitted wireframe update v2.4 in Figma', icon: 'figma' }
    ]
  },
  'proj-102': {
    projectId: 'proj-102',
    completionPercentage: 100,
    tasksCompleted: 4,
    totalTasks: 4,
    milestonesCompleted: 2,
    totalMilestones: 2,
    daysRemaining: 0,
    velocity: 2.0,
    weeklyProgress: [
      { week: 'Week 1', completed: 1, target: 1 },
      { week: 'Week 2', completed: 2, target: 2 },
      { week: 'Week 3', completed: 3, target: 3 },
      { week: 'Week 4', completed: 4, target: 4 }
    ],
    taskDistribution: [
      { name: 'Completed', value: 4, color: '#10b981' },
      { name: 'In Progress', value: 0, color: '#3b82f6' },
      { name: 'To Do', value: 0, color: '#64748b' }
    ],
    activityLog: [
      { id: 'act-10', date: '2026-05-15T18:00:00Z', user: 'Prof. Rajesh Kumar', action: 'Graded project: Final Score 95/100', icon: 'award' }
    ]
  }
};
