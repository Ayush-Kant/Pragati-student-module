# Pragati Placement Portal

Welcome to the Pragati Placement Portal. This guide details how to set up, initialize, and run both the Frontend and Backend services in a new environment.

## Prerequisites

- **Node.js**: v18.x or higher is recommended.
- **PostgreSQL**: An active PostgreSQL database instance.

---

## 1. Installation

Clone the repository and install dependencies in both the `backend` and `frontend` directories:

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 2. Environment Configuration

The backend requires a `.env` configuration file to communicate with your PostgreSQL instance and sign authentication tokens.

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
POSTGRESQL_URI=postgresql://<username>:<password>@<host>:<port>/<database_name>
JWT_SECRET=your_jwt_secret_key_here
RESEND_API_KEY=re_dummykey123
```

---

## 3. Database Initialization (Migrations & Seeds)

Pragati uses standard SQL migrations to set up schemas. To build the database tables and populate them with test training data, run the following scripts inside the `backend/` directory:

### Run Migrations (Fresh Database Setup)

```bash
node scripts/migrate.js
```

### Populate Seed Data (Pre-configured Credentials & Trainings)

```bash
node scripts/seed.js
```

---

## 4. Running the Application

### Start the Backend Server (Port 5000)

From the `backend/` directory:

```bash
npm run dev
```

### Start the Frontend Server (Vite)

From the `frontend/` directory:

```bash
npm run dev
```

The frontend will run locally at `http://localhost:5173`.

---

## 5. Pre-seeded Credentials

After running `seed.js`, you can log in immediately using the following accounts:

- **Corporate / Company Account**:
  - **Email**: `company@gmail.com`
  - **Password**: `Password123`
  - _Provides access to Dashboard, Candidate Management, Assessments, Interviews, Training Coordination, and Messages._

- **Mentor Account**:
  - **Email**: `mentor@example.com`
  - **Password**: `Password123`
  - _Provides access to Mentor feeds, Sessions, and content._

        "pg": "^8.21.0",
        "resend": "^6.12.3",
        "sequelize": "^3.35.1",
        "uuid": "^9.0.1"

    },
    "devDependencies": {
    "bin": {
    "uuid": "dist/bin/uuid"
    }
    },
    "node_modules/validator": {
    "version": "5.7.0",
    "resolved": "https://registry.npmjs.org/validator/-/validator-5.7.0.tgz",
    "integrity": "sha512-kHes0AATXms5NVgbJ4aDELR91O7+X+cxAS9d6I2z49MBhcAw6DYW4UCI8qv9NkL4+Mgx8jklt7gkCht+UHaZ+g==",
    "license": "MIT",
    "engines": {
    "node": ">= 0.10"
    }
    },
    "node_modules/vary": {
    "pg": "^8.21.0",
    "resend": "^6.12.3",
    "sequelize": "^3.35.1",
    "uuid": "^9.0.1"
    },
    "devDependencies": {
    import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
    import interviewRoutes from "./routes/interview.routes.js";
    import questionBankRouter from "./routes/questionBank.routes.js";
    import mentorRoutes from "./routes/mentor.routes.js";
    import trainingRoutes from "./routes/trainingRoutes.js";
    import dashboardRoutes from "./routes/dashboardRoutes.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
cors({
app.use("/api/v1/company/training", trainingRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/v1/admin/disputes", adminDisputeRoutes);
app.use("/api/v1/admin/notifications", adminNotificationRoutes);

app.get("/", (req, res) => {
res.json({
"node_modules/@oxc-project/types": {
"version": "0.133.0",
"license": "MIT",
"funding": {
"url": "https://github.com/sponsors/Boshen"
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"x64"
],
"license": "MIT",
"optional": true,
"os": [
"x64"
],
"license": "MIT",
"optional": true,
"os": [
"arm"
],
"license": "MIT",
"optional": true,
"os": [
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"ppc64"
],
"license": "MIT",
"optional": true,
"os": [
"s390x"
],
"license": "MIT",
"optional": true,
"os": [
"x64"
],
"license": "MIT",
"optional": true,
"os": [
"x64"
],
"license": "MIT",
"optional": true,
"os": [
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"wasm32"
],
"license": "MIT",
"optional": true,
"dependencies": {
"arm64"
],
"license": "MIT",
"optional": true,
"os": [
"x64"
],
"license": "MIT",
"optional": true,
"os": [
"node_modules/@rolldown/pluginutils": {
"version": "1.0.1",
"license": "MIT"
},
"node_modules/@standard-schema/spec": {
"node_modules/@types/react": {
"version": "19.2.17",
"devOptional": true,
"license": "MIT",
"dependencies": {
"csstype": "^3.2.2"
},
"node_modules/electron-to-chromium": {
"version": "1.5.382",
"resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.382.tgz",
"integrity": "sha512-8ETaWbV6SZOrno+G93Ffd9ENsMtetqdnqj4nlfxFW90Sm5GgnuV28Kf62hqQVD6VUgzm7qFQKsTsAPmeUiU3Ug==",
"dev": true,
"license": "ISC"
},
"node_modules/fdir": {
"version": "6.5.0",
"license": "MIT",
"engines": {
"node": ">=12.0.0"
"resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
"integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
"hasInstallScript": true,
"license": "MIT",
"optional": true,
}
},
"node_modules/marked": {
"version": "14.0.0",
"resolved": "https://registry.npmjs.org/marked/-/marked-14.0.0.tgz",
"integrity": "sha512-uIj4+faQ+MgHgwUW1l2PsPglZLOLOT1uErt06dAPtx2kjteLAkbsd/0FiYg/MGS+i7ZKLb7w2WClxHkzOOuryQ==",
"license": "MIT",
"peer": true,
"bin": {
"marked": "bin/marked.js"
},
"engines": {
"node": ">= 18"
}
},
"node_modules/math-intrinsics": {
"version": "1.1.0",
"license": "MIT",
"funding": {
"url": "https://github.com/sponsors/isaacs"
}
},
"node_modules/monaco-editor": {
"version": "0.55.1",
"resolved": "https://registry.npmjs.org/monaco-editor/-/monaco-editor-0.55.1.tgz",
"integrity": "sha512-jz4x+TJNFHwHtwuV9vA9rMujcZRb0CEilTEwG2rRSpe/A7Jdkuj8xPKttCgOh+v/lkHy7HsZ64oj+q3xoAFl9A==",
"license": "MIT",
"peer": true,
"dependencies": {
"dompurify": "3.2.7",
"marked": "14.0.0"
}
},
"node_modules/monaco-editor/node_modules/dompurify": {
"version": "3.2.7",
"resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.2.7.tgz",
"integrity": "sha512-WhL/YuveyGXJaerVlMYGWhvQswa7myDG17P7Vu65EWC05o8vfeNbvNf4d/BOvH99+ZW+LlQsc1GDKMa1vNK6dw==",
"license": "(MPL-2.0 OR Apache-2.0)",
"peer": true,
"optionalDependencies": {
"@types/trusted-types": "^2.0.7"
}
},
"node_modules/ms": {
"node_modules/picocolors": {
"version": "1.1.1",
"license": "ISC"
},
"node_modules/picomatch": {
"version": "4.0.4",
"license": "MIT",
"engines": {
"node": ">=12"
"node_modules/postcss": {
"version": "8.5.15",
"funding": [
{
"type": "opencollective",
"resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.15.tgz",
"integrity": "sha512-y7Wygv/7mEOvxTuEQDB8StXdMRBWf1kR/tlhAzBRUFkB2jfcLOAxO/SHmOO2zgz1pVgK29/kyupn059/bCHdjA==",
"funding": [
{
"type": "github",
"node_modules/rolldown": {
"version": "1.0.3",
"license": "MIT",
"dependencies": {
"@oxc-project/types": "=0.133.0",
"node_modules/tinyglobby": {
"version": "0.2.17",
"license": "MIT",
"dependencies": {
"fdir": "^6.5.0",
"node_modules/vite": {
"version": "8.0.16",
"license": "MIT",
"dependencies": {
"lightningcss": "^1.32.0",
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { getMentorPerformance } from "../services/adminService";

export default function useMentorDetail() {
const { id } = useParams();
return response.data;
};

export const assignAssessment = async (assessmentId, payload) => {
const response = await API.post(
`/api/v1/admin/assessments/${assessmentId}/assign`,
payload,
{
headers: {
Authorization: `Bearer ${getToken()}`,
},
},
);

return response.data;
};

// Mock Mentor Data - Fallback when backend is unavailable
const mockMentors = [
{
id: "mentor_001",
name: "Rohit Sharma",
email: "rohit@uptoskills.com",
expertise: ["MERN", "React", "Node.js"],
rating: 4.8,
activeBatches: 3,
isActive: true,
},
{
id: "mentor_002",
name: "Priya Singh",
email: "priya@uptoskills.com",
expertise: ["AI/ML", "Python"],
rating: 4.2,
activeBatches: 1,
isActive: true,
},
{
id: "mentor_003",
name: "Arjun Das",
email: "arjun@uptoskills.com",
expertise: ["Java", "Spring Boot"],
rating: 3.8,
activeBatches: 0,
isActive: false,
},
];

const mockMentorPerformance = {
mentor: {
id: "mentor_001",
name: "Rohit Sharma",
},
rating: 4.8,
totalReviews: 32,
completionRate: "87%",
avgAssignmentScore: 74,
recentFeedback: [
{
studentId: "stu_001",
rating: 5,
comment: "Very helpful and clear explanations.",
},
{
studentId: "stu_002",
rating: 4,
comment: "Good depth on backend topics.",
},
],
batchHistory: [
{
driveId: "drive_101",
batchId: "batch_301",
title: "MERN Batch 1",
status: "active",
},
{
driveId: "drive_099",
batchId: "batch_280",
title: "React Dev Batch",
status: "completed",
},
],
};

// Mentor Management APIs

export const getMentors = async () => {
if (USE_MOCK_DATA) {
return mockMentors;
}

try {
const response = await API.get("/api/v1/admin/mentors");
return response.data;
} catch (error) {
return mockMentors;
}
};

export const getMentorById = async (mentorId) => {
if (USE_MOCK_DATA) {
const mentor = mockMentors.find((m) => m.id === mentorId);
return mentor || mockMentors[0];
}

try {
const response = await API.get(`/api/v1/admin/mentors/${mentorId}`);
return response.data;
} catch (error) {
const mentor = mockMentors.find((m) => m.id === mentorId);
return mentor || mockMentors[0];
}
};

export const getMentorPerformance = async (mentorId) => {
if (USE_MOCK_DATA) {
return {
...mockMentorPerformance,
mentor: {
...mockMentorPerformance.mentor,
id: mentorId,
},
};
}

try {
const response = await API.get(`/api/v1/admin/mentors/${mentorId}/performance`);
return response.data;
} catch (error) {
return {
...mockMentorPerformance,
mentor: {
...mockMentorPerformance.mentor,
id: mentorId,
},
};
}
};

export const createMentor = async (mentorData) => {
if (USE_MOCK_DATA) {
return { success: true, data: mentorData };
}

try {
const response = await API.post("/api/v1/admin/mentors", mentorData);
return response.data;
} catch (error) {
return { success: true, data: mentorData };
}
};

export const assignMentor = async (mentorId, batchId) => {
if (USE_MOCK_DATA) {
return { success: true, mentorId, batchId };
}

try {
const response = await API.patch(
`/api/v1/admin/mentors/${mentorId}/assign`,
{ batchId }
);
return response.data;
} catch (error) {
return { success: true, mentorId, batchId };
}
};

export const replaceMentor = async (mentorId, newMentorId) => {
if (USE_MOCK_DATA) {
return { success: true, mentorId, newMentorId };
}

try {
const response = await API.patch(
`/api/v1/admin/mentors/${mentorId}/replace`,
{ newMentorId }
);
return response.data;
} catch (error) {
return { success: true, mentorId, newMentorId };
}
};

export const deleteMentor = async (mentorId) => {
if (USE_MOCK_DATA) {
return { success: true, mentorId };
}

try {
const response = await API.delete(`/api/v1/admin/mentors/${mentorId}`);
return response.data;
} catch (error) {
return { success: true, mentorId };
}
};

const menuItems = [
{
name: "Dashboard",
path: "/mentor/dashboard",
icon: <LayoutDashboard className="w-5 h-5" />,
},
{
name: "Projects",
path: "/mentor/projects/create",
icon: <Briefcase className="w-5 h-5" />,
},
{
name: "My Mentees",
path: "/mentor/mentees",
icon: <Users className="w-5 h-5" />,
},
{
name: "Sessions",
path: "/mentor/sessions",
icon: <CalendarDays className="w-5 h-5" />,
},
{
name: "Assessments",
path: "/mentor/assessments",
icon: <ClipboardList className="w-5 h-5" />,
},
{
name: "Tasks & Assignments",
path: "/mentor/tasks",
icon: <ListTodo className="w-5 h-5" />,
},
{
name: "Reports & Analytics",
path: "/mentor/export-report",
icon: <LineChart className="w-5 h-5" />,
},
{ name: "Settings", path: "#", icon: <Settings className="w-5 h-5" /> },
];

const isItemActive = (item) => {
if (item.path === "#") return false;
import Activities from "../pages/Activities";
import CreateActivity from "../pages/CreateActivity";
import ProjectCreationPage from "../pages/ProjectCreationPage";

import QuestionBankPage from "../pages/QuestionBankPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import EditQuestionPage from "../pages/EditQuestionPage";
import QuestionPreviewPage from "../pages/QuestionPreviewPage";
import QuizBuilderPage from "../pages/QuizBuilderPage";
import AttemptHistoryPage from "../pages/AttemptHistoryPage";

const mentorRoute = (
<Route element={<PrivateRoute />}>
<Route path="dashboard" element={<Dashboard />} />
<Route path="export-report" element={<ExportReport />} />
<Route path="projects/create" element={<ProjectCreationPage />} />
<Route element={<ActivityProvider />}>
<Route path="activities" element={<Activities />} />
<Route path="activities/create" element={<CreateActivity />} />
</Route>

        <Route path="question-bank" element={<QuestionBankPage />} />

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
const { isAuthenticated, userRole } = useAuth();

if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

if (!userRole) {
return <Navigate to="/login" replace />;
}

return <Outlet />;
};

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
const { userRole, isAuthenticated } = useAuth();
console.log("RoleRoute: userRole =", userRole, "isAuthenticated =", isAuthenticated, "allowedRoles =", allowedRoles);

if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

if (!allowedRoles.includes(userRole)) {
return <Navigate to={`/${userRole}/dashboard`} replace />;
}

return <Outlet />;
};
