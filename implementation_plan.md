# Conflict Resolution Plan: Recommended Changes for `college-team` Branch

This implementation plan details the recommended changes that must be applied to the `college-team` branch (PR 363) to resolve all merge conflicts with the `develop` branch and prevent breaking existing company, mentor, and student features.

---

## User Review Required

> [!IMPORTANT]
> **Do Not Delete/Rewrite Existing Code**: The college-team branch must merge, not overwrite, existing imports, routes, and migrations.
> - **Company Routing**: Revert the wildcard route change (`/company/*`) and preserve the explicit routes inside `CompanyRoute.jsx`.
> - **Migration Sequences**: Do not change the sequencing of `migrate.js` to alphabetical; instead, append any new SQL migration files to the bottom of the existing `migrationFiles` execution array.

---

## Proposed Changes on `college-team` Branch

### 1. Resolve Package Manifest Conflicts (`package.json`)

#### [MODIFY] [package.json](file:///g:/Pragati_company/Pragati/backend/package.json)
Merge the backend dependencies block so it includes packages from both branches:
```json
"dependencies": {
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dns": "^0.1.2",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "joi": "^18.2.3",
  "jsonwebtoken": "^9.0.3",
  "node-pg": "^1.0.1",
  "nodemon": "^3.1.14",
  "pg": "^8.21.0",
  "resend": "^6.12.3",
  "sequelize": "^6.37.8",
  "uuid": "^9.0.1"
}
```

#### [MODIFY] [package.json](file:///g:/Pragati_company/Pragati/frontend/package.json)
Merge the frontend dependencies block so that React 19 packages and TailwindCSS v4 configurations from the develop branch are preserved alongside any custom packages added by the college-team branch.

---

### 2. Resolve Backend Routes Conflict (`backend/server.js`)

#### [MODIFY] [server.js](file:///g:/Pragati_company/Pragati/backend/server.js)
Update `server.js` to import and mount **both** sets of route handlers:
- **Keep all existing imports**: `companyProfileRoutes`, `companyAssessmentRoutes`, `trainingRoutes`, `dashboardRoutes`, etc.
- **Keep all new imports**: `collegeProfileRoutes`, `collegeDashboardRoutes`, `collegeJobsRoutes`, `departmentRoutes`, `courseRoutes`, `departmentStatisticsRoutes`.
- **Mount all routes**: Ensure `app.use` handles all endpoints from both modules.

---

### 3. Resolve SQL Schema & Migrations Conflict

#### [MODIFY] [migrate.js](file:///g:/Pragati_company/Pragati/backend/scripts/migrate.js)
Revert the change that runs SQL scripts alphabetically. Keep the main branch's migration sequence drop logic and append any new SQL filenames introduced by the college-team branch to the bottom of the `migrationFiles` array:
```javascript
const migrationFiles = [
  // ... existing migrations ...
  "010_create_disputes.sql",
  "Students.sql",
  "011_create_college_courses.sql", // Append new files here
  "012_create_job_tables.sql"       // Append new files here
];
```

#### [MODIFY] [Students.sql](file:///g:/Pragati_company/Pragati/backend/migrations/Students.sql)
Ensure the `updated_at` column is appended to the table definition without replacing or omitting the existing columns of the `students` table.

---

### 4. Resolve Frontend Routing & Layout Conflicts

#### [MODIFY] [App.jsx](file:///g:/Pragati_company/Pragati/frontend/src/App.jsx)
Ensure that `{collegeRoute}`, `{mentorRoute}`, `{AdminRoute}`, `{StudentRoutes}`, and `{CompanyRoute}` are all rendered under the main `<Routes>` component.

#### [MODIFY] [AppRoutes.jsx](file:///g:/Pragati_company/Pragati/frontend/src/features/college/routes/AppRoutes.jsx)
Secure the new college routes (dashboard, database page, profile settings) inside the existing `PrivateRoute` and `RoleRoute` protection wrappers:
```javascript
const collegeRoute = (
  <Route element={<PrivateRoute />}>
    <Route element={<RoleRoute allowedRoles={['college']} />}>
      <Route path="college" element={<CollegeLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="student" element={<StudentDatabasePage />} />
        <Route path="profile" element={<CollegeProfilePage />} />
        <Route path="update-profile" element={<OrganizationProfile />} />
        <Route path="company-job-postings" element={<CompanyJobPostingsPage />} />
        <Route path="companies" element={<CompanyJobPostingsPage />} />
      </Route>
    </Route>
  </Route>
);
```

#### [MODIFY] [CompanyRoute.jsx](file:///g:/Pragati_company/Pragati/frontend/src/features/company/routes/CompanyRoute.jsx)
Revert the wildcard `/company/*` mapping. Keep our explicit routes definition mapping the dashboard, drives, assessments, interviews, training, messages, offers, and settings, so that nested layout views do not render blank.

#### [DELETE] [AppRoutes.jsx](file:///g:/Pragati_company/Pragati/frontend/src/routes/AppRoutes.jsx)
Delete the unused generic `AppRoutes.jsx` file to keep the project structure clean and organized.

---

## Execution Steps for the College Team

1. **Pull develop updates**:
   ```bash
   git checkout college-team
   git pull origin develop
   ```
2. **Resolve Conflicts**: Apply the resolution mapping outlined above in the editor.
3. **Rebuild Manifests**:
   - `git checkout HEAD -- backend/package-lock.json frontend/package-lock.json`
   - Run `npm install` in both folders.
4. **Commit & Push**:
   - `git add .`
   - `git commit -m "conflict resolution: align college-team branch with develop and fix company routing"`
   - `git push origin college-team`
