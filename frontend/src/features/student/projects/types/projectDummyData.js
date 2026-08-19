/**
 * Dummy data for the Advanced Project Workspace feature (MOD-07).
 *
 * Replace service function bodies with real API calls when the backend is ready.
 * No callers outside the service layer should import this file directly.
 */

import {
  PROJECT_STATUS,
  MILESTONE_STATUS,
  SUBMISSION_STATE,
} from '../constants/projectConstants';

// ─── Projects ─────────────────────────────────────────────────────────────────

export const dummyProjects = [
  {
    id: 'proj-001',
    title: 'E-Commerce Platform with React & Node.js',
    description:
      'Build a fully functional e-commerce platform with product listings, cart management, payment integration, and an admin dashboard. Demonstrate full-stack proficiency using modern tooling.',
    objectives: [
      'Implement a responsive product catalog with search and filter functionality.',
      'Build a shopping cart with persisted state and checkout flow.',
      'Integrate a payment gateway (Stripe sandbox).',
      'Create a RESTful API with authentication and role-based access.',
      'Deploy the application to a cloud provider.',
    ],
    requirements: [
      'React 18+ with functional components and hooks',
      'Node.js / Express backend with JWT authentication',
      'PostgreSQL or MongoDB for data persistence',
      'Stripe payment gateway integration',
      'Responsive UI — mobile, tablet, desktop',
      'Jest / Vitest unit and integration tests (≥80% coverage)',
      'Deployed live URL required',
    ],
    deliverables: [
      'GitHub repository with clean commit history',
      'Deployed live URL (Vercel / Railway / Render)',
      'API documentation (Swagger or README)',
      'Project report (PDF)',
      'Recorded demo video (5-10 min)',
    ],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe', 'Docker', 'Vercel'],
    resources: [
      { label: 'React Documentation', url: 'https://react.dev' },
      { label: 'Stripe Sandbox Docs', url: 'https://stripe.com/docs/testing' },
      { label: 'Project Starter Template', url: 'https://github.com/example/starter' },
    ],
    evaluationCriteria: [
      { id: 'ec-1', criterion: 'Functionality & Completeness', maxScore: 30, weight: 30 },
      { id: 'ec-2', criterion: 'Code Quality & Architecture',  maxScore: 25, weight: 25 },
      { id: 'ec-3', criterion: 'UI/UX & Responsiveness',       maxScore: 20, weight: 20 },
      { id: 'ec-4', criterion: 'Testing Coverage',             maxScore: 15, weight: 15 },
      { id: 'ec-5', criterion: 'Documentation & Deployment',   maxScore: 10, weight: 10 },
    ],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    assignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: PROJECT_STATUS.IN_PROGRESS,
    overallProgress: 55,
    submissionStatus: null,
    evaluationStatus: null,
    mentorName: 'Priya Sharma',
    batchName: 'Full Stack Batch 2024',
    durationWeeks: 8,
  },
  {
    id: 'proj-002',
    title: 'Real-Time Chat Application',
    description:
      'Design and develop a real-time group chat application supporting channels, direct messages, file sharing, and online presence indicators using WebSockets.',
    objectives: [
      'Implement WebSocket-based real-time messaging.',
      'Support multiple chat rooms / channels.',
      'Add direct messaging between users.',
      'Show online/offline presence indicators.',
      'Allow file and image sharing within chats.',
    ],
    requirements: [
      'React frontend with Socket.IO client',
      'Node.js + Socket.IO server',
      'Redis for pub/sub and session management',
      'Message persistence in MongoDB',
      'Emoji reactions and read receipts',
    ],
    deliverables: [
      'GitHub repository',
      'Deployed live demo',
      'Architecture diagram',
      'Project report',
    ],
    techStack: ['React', 'Socket.IO', 'Node.js', 'Redis', 'MongoDB'],
    resources: [
      { label: 'Socket.IO Documentation', url: 'https://socket.io/docs/v4/' },
      { label: 'Redis Pub/Sub Guide',     url: 'https://redis.io/topics/pubsub' },
    ],
    evaluationCriteria: [
      { id: 'ec-1', criterion: 'Real-time Functionality', maxScore: 35, weight: 35 },
      { id: 'ec-2', criterion: 'Scalability & Architecture', maxScore: 25, weight: 25 },
      { id: 'ec-3', criterion: 'UI/UX Polish',           maxScore: 20, weight: 20 },
      { id: 'ec-4', criterion: 'Documentation',          maxScore: 20, weight: 20 },
    ],
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (overdue)
    assignedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: PROJECT_STATUS.EVALUATED,
    overallProgress: 100,
    submissionStatus: SUBMISSION_STATE.EVALUATED,
    evaluationStatus: 'evaluated',
    mentorName: 'Rahul Verma',
    batchName: 'Full Stack Batch 2024',
    durationWeeks: 6,
  },
  {
    id: 'proj-003',
    title: 'AI-Powered Resume Builder',
    description:
      'Create an AI-assisted resume builder that helps users craft professional resumes with smart suggestions, multiple templates, and PDF export functionality.',
    objectives: [
      'Build a multi-step resume form with validation.',
      'Integrate an AI API (OpenAI / Gemini) for content suggestions.',
      'Provide at least 3 professional resume templates.',
      'Support PDF export with pixel-perfect layout.',
      'Allow users to save and manage multiple resumes.',
    ],
    requirements: [
      'React with drag-and-drop section reordering',
      'Integration with an AI text generation API',
      'PDF export (html2canvas / jsPDF)',
      'LocalStorage or backend persistence',
      'Responsive across devices',
    ],
    deliverables: [
      'GitHub repository',
      'Deployed live URL',
      'AI integration documentation',
      'Project report',
    ],
    techStack: ['React', 'OpenAI API', 'jsPDF', 'Tailwind CSS'],
    resources: [
      { label: 'OpenAI API Reference', url: 'https://platform.openai.com/docs' },
      { label: 'jsPDF Documentation', url: 'https://github.com/parallax/jsPDF' },
    ],
    evaluationCriteria: [
      { id: 'ec-1', criterion: 'AI Integration Quality',    maxScore: 30, weight: 30 },
      { id: 'ec-2', criterion: 'Template Quality & Design', maxScore: 25, weight: 25 },
      { id: 'ec-3', criterion: 'Functionality',             maxScore: 25, weight: 25 },
      { id: 'ec-4', criterion: 'Code Quality',              maxScore: 20, weight: 20 },
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: PROJECT_STATUS.NOT_STARTED,
    overallProgress: 0,
    submissionStatus: null,
    evaluationStatus: null,
    mentorName: 'Anita Patel',
    batchName: 'Full Stack Batch 2024',
    durationWeeks: 5,
  },
];

// ─── Milestones ────────────────────────────────────────────────────────────────

export const dummyMilestones = {
  'proj-001': [
    {
      id: 'ms-001-1',
      projectId: 'proj-001',
      title: 'Project Setup & Architecture',
      description:
        'Initialize repositories, configure CI/CD, define folder structure, set up database schema, and write the architecture document.',
      dueDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 1,
    },
    {
      id: 'ms-001-2',
      projectId: 'proj-001',
      title: 'Product Catalog & Search',
      description:
        'Build product listing page with grid/list views, search bar, category filters, sorting options, and product detail modal.',
      dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 2,
    },
    {
      id: 'ms-001-3',
      projectId: 'proj-001',
      title: 'Shopping Cart & Checkout',
      description:
        'Implement add-to-cart, quantity management, cart persistence with localStorage, multi-step checkout form, and order summary.',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.IN_PROGRESS,
      progress: 70,
      order: 3,
    },
    {
      id: 'ms-001-4',
      projectId: 'proj-001',
      title: 'Payment Integration',
      description:
        'Integrate Stripe payment gateway with sandbox mode, implement webhook handling, and show order confirmation page.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 4,
    },
    {
      id: 'ms-001-5',
      projectId: 'proj-001',
      title: 'Admin Dashboard & Deployment',
      description:
        'Build admin panel for product/order management, write tests to achieve ≥80% coverage, and deploy to production.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 5,
    },
  ],
  'proj-002': [
    {
      id: 'ms-002-1',
      projectId: 'proj-002',
      title: 'WebSocket Server Setup',
      description: 'Configure Socket.IO server, Redis pub/sub, and establish basic message broadcasting.',
      dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 1,
    },
    {
      id: 'ms-002-2',
      projectId: 'proj-002',
      title: 'Channel & Direct Messaging',
      description: 'Implement channel creation, joining, message threads, and 1-on-1 direct messages.',
      dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 2,
    },
    {
      id: 'ms-002-3',
      projectId: 'proj-002',
      title: 'File Sharing & Presence',
      description: 'Add file/image upload to chats, online presence indicators, and read receipts.',
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 3,
    },
    {
      id: 'ms-002-4',
      projectId: 'proj-002',
      title: 'Polish & Deployment',
      description: 'UI polish, emoji reactions, accessibility review, and production deployment.',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.COMPLETED,
      progress: 100,
      order: 4,
    },
  ],
  'proj-003': [
    {
      id: 'ms-003-1',
      projectId: 'proj-003',
      title: 'Project Planning & Setup',
      description: 'Define feature scope, set up repository, configure tooling, and sketch wireframes.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 1,
    },
    {
      id: 'ms-003-2',
      projectId: 'proj-003',
      title: 'Resume Form & Templates',
      description: 'Build multi-step form with validation, implement 3 resume templates with live preview.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 2,
    },
    {
      id: 'ms-003-3',
      projectId: 'proj-003',
      title: 'AI Integration & PDF Export',
      description: 'Integrate AI suggestion API, build PDF export with exact layout matching, and test output quality.',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 3,
    },
    {
      id: 'ms-003-4',
      projectId: 'proj-003',
      title: 'Persistence & Deployment',
      description: 'Add save/load functionality, polish UX, deploy, and record demo video.',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: MILESTONE_STATUS.PENDING,
      progress: 0,
      order: 4,
    },
  ],
};

// ─── Submissions ───────────────────────────────────────────────────────────────

export const dummySubmissions = {
  'proj-002': {
    id: 'sub-002-1',
    projectId: 'proj-002',
    version: 1,
    githubUrl: 'https://github.com/student/realtime-chat',
    deploymentUrl: 'https://realtime-chat.vercel.app',
    description:
      'Full real-time chat application with Socket.IO, Redis pub/sub, and MongoDB persistence. Supports channels, DMs, file sharing, and emoji reactions.',
    documentation: 'See README.md in the repository for setup instructions and architecture overview.',
    additionalComments: 'All milestones completed ahead of schedule. Redis cluster was the most challenging part.',
    files: [
      { id: 'f-1', name: 'project-report.pdf', size: 2_450_000, type: 'application/pdf', uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'f-2', name: 'architecture-diagram.png', size: 840_000, type: 'image/png', uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: SUBMISSION_STATE.EVALUATED,
  },
};

// ─── Submission History ────────────────────────────────────────────────────────

export const dummySubmissionHistory = {
  'proj-002': [
    {
      id: 'sub-002-1',
      projectId: 'proj-002',
      version: 1,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: SUBMISSION_STATE.EVALUATED,
      feedback: 'Excellent work on the WebSocket implementation. Redis pub/sub usage is clean and scalable. Minor UI consistency issues noted.',
      canResubmit: false,
    },
  ],
};

// ─── Evaluations ───────────────────────────────────────────────────────────────

export const dummyEvaluations = {
  'proj-002': {
    id: 'eval-002-1',
    projectId: 'proj-002',
    evaluatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    evaluatedBy: 'Rahul Verma',
    totalScore: 88,
    maxScore: 100,
    percentage: 88,
    grade: 'A',
    status: 'evaluated',
    criteria: [
      { id: 'ec-1', criterion: 'Real-time Functionality', maxScore: 35, scored: 33, feedback: 'WebSocket implementation is solid. Latency is minimal. Presence indicators work correctly.' },
      { id: 'ec-2', criterion: 'Scalability & Architecture', maxScore: 25, scored: 22, feedback: 'Good use of Redis pub/sub. Minor improvements possible in connection pooling.' },
      { id: 'ec-3', criterion: 'UI/UX Polish', maxScore: 20, scored: 18, feedback: 'Clean, modern interface. Mobile responsiveness could be improved slightly.' },
      { id: 'ec-4', criterion: 'Documentation', maxScore: 20, scored: 15, feedback: 'README is thorough. Architecture diagram is helpful. API docs are missing.' },
    ],
    overallFeedback:
      'Outstanding project! The real-time messaging is production-quality. The Redis architecture shows strong backend understanding. Focus on documentation completeness in future projects.',
    suggestions: [
      'Add API documentation (Swagger/OpenAPI) for the backend endpoints.',
      'Improve mobile responsiveness in the file-sharing UI.',
      'Consider adding message search functionality for a richer feature set.',
    ],
  },
};
