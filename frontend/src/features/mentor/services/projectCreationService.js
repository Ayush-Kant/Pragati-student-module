import api from "../../../services/api";

// Fallback Mock Data for local frontend development if backend is not yet ready
const MOCK_SKILLS = [
  "React", "Node.js", "MongoDB", "Express", "TypeScript", 
  "Tailwind CSS", "PostgreSQL", "Next.js", "GraphQL", 
  "Docker", "Python", "Flask", "Django", "AWS", 
  "Figma", "UI/UX", "Git", "Redux", "SQL", "Jest"
];

const MOCK_TEMPLATES = [
  {
    id: "tpl-ecommerce",
    title: "Full Stack E-Commerce Dashboard",
    description: "Build a comprehensive admin dashboard with React, Node.js, and PostgreSQL. Features include real-time inventory tracking, orders, and payment integrations.",
    content: `### Full Stack E-Commerce Dashboard

**Goal**: Build a complete e-commerce product catalog and analytics panel.

**Core Requirements**:
1. **Frontend**: Clean dashboard built with React + Tailwind CSS.
2. **Backend**: Node.js Express server connected to PostgreSQL.
3. **Database**: Implement schemas for Users, Products, Orders, and Category.
4. **Auth**: Setup JWT authentication with login/register.
5. **State Management**: Utilize Context API or Redux for shopping cart flow.

**Deliverables**:
- GitHub Repository link with both backend and frontend code.
- Live deployment URL (Vercel/Render).
- Comprehensive README documentation detailing setup and environment variables.
`
  },
  {
    id: "tpl-analytics",
    title: "Real-time Analytics Panel",
    description: "Create a live monitoring system using WebSockets, React Query, and charting libraries.",
    content: `### Real-time Analytics Panel

**Goal**: Build an analytics application tracking streaming data updates.

**Core Requirements**:
1. **Data Visualization**: Recharts or Chart.js for beautiful analytics.
2. **WebSockets**: Live socket connection for state changes.
3. **Optimistic Updates**: React Query implementation for API transactions.

**Setup Instructions**:
- Clone frontend/backend seed templates.
- Configure MongoDB for metric storage.
`
  },
  {
    id: "tpl-collaboration",
    title: "Team Task Management Workspace",
    description: "Design a Kanban-style workspace with real-time sync, task filters, and roles authorization.",
    content: `### Team Task Management Workspace

**Goal**: Develop a project workspace with drag-and-drop task items.

**Core Requirements**:
1. **Interactive Boards**: Columns for Backlog, In Progress, Review, and Done.
2. **Drag & Drop**: Utilize @dnd-kit/core or similar.
3. **Roles Management**: Admin, Board Owner, Contributor access.
`
  }
];

export const projectCreationService = {
  // POST /api/v1/projects
  createProject: async (projectData) => {
    try {
      const response = await api.post("/v1/projects", projectData);
      return response.data;
    } catch (error) {
      console.warn("Backend project creation API failed. Simulating success using Mock Data.", error);
      // Return a simulated success response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Project created successfully (Simulated)",
            project: {
              id: `proj_${Math.random().toString(36).substr(2, 9)}`,
              ...projectData,
              createdAt: new Date().toISOString()
            }
          });
        }, 1000);
      });
    }
  },

  // GET /api/v1/skills
  fetchSkills: async () => {
    try {
      const response = await api.get("/v1/skills");
      return response.data;
    } catch (error) {
      console.warn("Backend skills API failed. Falling back to Mock Data.", error);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_SKILLS);
        }, 300);
      });
    }
  },

  // GET /api/v1/project/templates
  fetchTemplates: async () => {
    try {
      const response = await api.get("/v1/project/templates");
      return response.data;
    } catch (error) {
      console.warn("Backend project templates API failed. Falling back to Mock Data.", error);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_TEMPLATES);
        }, 300);
      });
    }
  }
};

export default projectCreationService;
