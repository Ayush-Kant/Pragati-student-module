// Dummy data for projects, mimicking a real database schema
export const projects = [
  {
    projectId: "project-001",
    title: "E-Commerce Capstone",
    description: "Build a highly scalable, fully responsive full-stack e-commerce platform featuring search indexing, automated checkout workflows, and dashboard analytics.",
    scope: "Design and implement both front-end and back-end architectures, establish secure payment gateway integrations, and configure auto-scaling infrastructure.",
    deliverables: [
      "Responsive React client with server-side rendering support",
      "Robust RESTful API implementing microservices architecture",
      "Fully documented database schema (SQL)",
      "Unit and integration test suites reaching 80%+ coverage"
    ],
    milestones: [
      {
        id: "m1",
        number: 1,
        title: "Database Schema Design & Setup",
        dueAt: "2026-07-10T23:59:00Z", // Past, Submitted
        submitted: true,
        submissionDetails: {
          githubUrl: "https://github.com/musthafa-pragati/ecommerce-capstone",
          notes: "Completed database design including users, products, orders, and payment tables. Set up PostgreSQL container and initialized migrations.",
          deployedUrl: "https://ecommerce-db.pragati-demo.com",
          submittedAt: "2026-07-09T18:45:00Z"
        }
      },
      {
        id: "m2",
        number: 2,
        title: "Backend API Implementation & Auth",
        dueAt: "2026-07-18T23:59:00Z", // Past, Submitted
        submitted: true,
        submissionDetails: {
          githubUrl: "https://github.com/musthafa-pragati/ecommerce-capstone",
          notes: "Implemented JWT authentication, user registration/login, product CRUD APIs, and cart operations. Covered with postman collection and unit tests.",
          deployedUrl: "https://api-ecommerce.pragati-demo.com",
          submittedAt: "2026-07-17T22:15:00Z"
        }
      },
      {
        id: "m3",
        number: 3,
        title: "Frontend Integration & Checkout Flow",
        dueAt: "2026-07-30T23:59:00Z", // Future, Pending
        submitted: false,
        submissionDetails: null
      }
    ],
    finalDueAt: "2026-08-15T23:59:00Z", // Future, Pending
    rubric: [
      { criterion: "System Architecture & API Design", weight: 30 },
      { criterion: "Frontend Responsiveness & UI/UX", weight: 30 },
      { criterion: "Security & Authentication", weight: 20 },
      { criterion: "Testing & Documentation", weight: 20 }
    ],
    submission: null
  },
  {
    projectId: "project-002",
    title: "AI-Powered Chat Application",
    description: "Create a real-time collaborative chat application featuring automated sentiment analysis, AI translation capabilities, and interactive markdown support.",
    scope: "Set up WebSockets for real-time bidirectional communication, integrate LLM services for AI extensions, and design an ultra-low latency frontend client.",
    deliverables: [
      "WebSocket server supporting persistent connections and rooms",
      "Gemini AI API wrapper service for chat enrichment",
      "Rich text editor with markdown preview pane",
      "Containerized deployment configurations (Docker Compose)"
    ],
    milestones: [
      {
        id: "m1",
        number: 1,
        title: "WebSocket Server & Basic Rooms",
        dueAt: "2026-08-05T23:59:00Z", // Future, Pending
        submitted: false,
        submissionDetails: null
      },
      {
        id: "m2",
        number: 2,
        title: "AI Service Integration & UI Panels",
        dueAt: "2026-08-18T23:59:00Z", // Future, Pending
        submitted: false,
        submissionDetails: null
      }
    ],
    finalDueAt: "2026-08-30T23:59:00Z", // Future, Pending
    rubric: [
      { criterion: "Real-time Sync & Socket Reliability", weight: 35 },
      { criterion: "AI Functionality & LLM Prompts", weight: 25 },
      { criterion: "Interface Design & Fluid Animations", weight: 20 },
      { criterion: "Security (XSS prevention & sanitization)", weight: 20 }
    ],
    submission: null
  },
  {
    projectId: "project-003",
    title: "DevOps Pipeline Automation",
    description: "Automate build, test, and containerized deployment cycles using modern CI/CD tools, infrastructure-as-code models, and security scanners.",
    scope: "Write Terraform configuration files, establish GitHub Actions workflows with security vulnerability scanning, and deploy to Kubernetes.",
    deliverables: [
      "Terraform files for provisioning Google Cloud Resources",
      "GitHub Actions workflow files executing linters, tests, and builds",
      "Helm charts for application deployment on GKE",
      "Prometheus & Grafana dashboards configuration"
    ],
    milestones: [
      {
        id: "m1",
        number: 1,
        title: "Terraform Infrastructure Scaffolding",
        dueAt: "2026-07-02T23:59:00Z", // Past, Submitted
        submitted: true,
        submissionDetails: {
          githubUrl: "https://github.com/musthafa-pragati/devops-pipeline",
          notes: "Configured Google provider, set up VPC, subnetworks, and GKE cluster configurations in Terraform modules.",
          deployedUrl: null,
          submittedAt: "2026-07-01T15:30:00Z"
        }
      },
      {
        id: "m2",
        number: 2,
        title: "CI/CD Setup & Security Scanners",
        dueAt: "2026-07-12T23:59:00Z", // Past, Submitted
        submitted: true,
        submissionDetails: {
          githubUrl: "https://github.com/musthafa-pragati/devops-pipeline",
          notes: "Created GitHub Actions runner. Integrated SonarQube and Trivy container scanning. All builds succeed on branch push.",
          deployedUrl: "https://actions.github.com/musthafa-pragati/devops-pipeline",
          submittedAt: "2026-07-11T12:00:00Z"
        }
      }
    ],
    finalDueAt: "2026-07-20T23:59:00Z", // Past, Fully Submitted
    rubric: [
      { criterion: "CI/CD Pipeline Design & Speed", weight: 35 },
      { criterion: "Infrastructure as Code Structure", weight: 30 },
      { criterion: "Kubernetes Configs & Helm Charts", weight: 20 },
      { criterion: "Monitoring & Alerting Setup", weight: 15 }
    ],
    submission: {
      githubUrl: "https://github.com/musthafa-pragati/devops-pipeline",
      deployedUrl: "https://grafana.pragati-devops.com",
      reportFileName: "DevOps_Automation_Final_Report.pdf",
      reportFileSize: "4.8 MB",
      submittedAt: "2026-07-19T21:40:00Z"
    }
  },
  {
    projectId: "project-004",
    title: "Portfolio Website Builder",
    description: "Design a template-driven portfolio website builder empowering creative users to drag, drop, and publish their personal bios and work samples.",
    scope: "Implement standard components with customizable themes, compile static HTML previews dynamically, and integrate direct publishing models.",
    deliverables: [
      "Custom drag-and-drop editor interface",
      "Dynamic visual styling controller using CSS variables",
      "Static generation compiler running in-browser",
      "Export to ZIP or direct deployment mechanism"
    ],
    milestones: [
      {
        id: "m1",
        number: 1,
        title: "Layout Grid & Component Palette",
        dueAt: "2026-06-15T23:59:00Z", // Past, Submitted
        submitted: true,
        submissionDetails: {
          githubUrl: "https://github.com/musthafa-pragati/portfolio-builder",
          notes: "Developed custom drag handles and grid containers using react-grid-layout.",
          deployedUrl: "https://designer.pragati-builder.com",
          submittedAt: "2026-06-14T23:00:00Z"
        }
      },
      {
        id: "m2",
        number: 2,
        title: "In-Browser Compiler & PDF exporter",
        dueAt: "2026-07-15T23:59:00Z", // Past, Deadline Passed
        submitted: false,
        submissionDetails: null
      }
    ],
    finalDueAt: "2026-07-20T23:59:00Z", // Past, Deadline Passed
    rubric: [
      { criterion: "Editor Interaction & Performance", weight: 40 },
      { criterion: "Generated Code Quality (HTML/CSS)", weight: 30 },
      { criterion: "Direct Publishing Mechanism", weight: 20 },
      { criterion: "Pre-built Templates Variety", weight: 10 }
    ],
    submission: null
  }
];

export const projectApiResponse = { success: true, data: projects };
