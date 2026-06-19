# Recruitment Drives Feature

## Overview
The Recruitment Drives feature allows companies to create and manage recruitment campaigns with candidates, stages, and deadlines.

## Components

### Pages
- **RecruitmentDrives.jsx**: Main container component that manages state and data filtering

### Components
- **DrivesHeader.jsx**: Title section with "Create Drive" button
- **DriveFilters.jsx**: Compact filter toolbar (Search, Status, Department, Year)
- **DrivesTable.jsx**: Main table displaying all recruitment drives
- **DriveRow.jsx**: Individual table row component
- **CreateDriveDrawer.jsx**: Right-side drawer for creating new recruitment drives
- **StageBadge.jsx**: Status badge component with color coding

## Features

1. **Filter Toolbar**
   - Search by drive name
   - Filter by status (Active, Assessment, Interview, Screening)
   - Filter by department
   - Filter by year

2. **Drives Table**
   - Display drive name and role
   - Show candidate count with icon
   - Display recruitment stage with colored badge
   - Show application deadline
   - Action menu (three-dot)

3. **Create Recruitment Drive Drawer**
   - Slide-in right drawer with close button
   - Form fields: Job Title, Department, Skills, Salary, Work Mode, Location, Eligibility, Deadline, Description
   - Radio buttons for work mode (Remote, On-site, Hybrid)
   - Sticky footer with Save Draft and Publish Drive buttons
   - ESC key to close
   - Overlay click to close

## Styling

- **Modern SaaS Design**: Consistent with Candidate Management page
- **Tailwind CSS**: Utility-first styling
- **Rounded corners**: 2xl for modern appearance
- **Soft borders**: Gray-100 borders for subtle separation
- **Smooth transitions**: Hover states and animations

## Data Structure

```javascript
{
  id: number,
  driveName: string,
  role: string,
  candidates: number,
  stage: 'Active' | 'Assessment' | 'Interview' | 'Screening',
  deadline: string,
  department: string,
}
```
