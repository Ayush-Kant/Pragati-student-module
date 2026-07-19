# Candidate Management Module

This module provides a complete candidate management system for the company dashboard.

## Structure

```
candidates/
├── pages/
│   └── CandidateManagement.jsx       # Main page component
├── components/
│   ├── CandidateHeader.jsx           # Page header with title and subtitle
│   ├── CandidateFilters.jsx          # Search and filter controls
│   ├── CandidateTable.jsx            # Table to display candidates
│   ├── CandidateRow.jsx              # Individual table row component
│   ├── CandidateDrawer.jsx           # Right-side panel for candidate details
│   └── StatusBadge.jsx               # Status badge component
├── hooks/
│   └── useCandidates.js              # Custom hook for candidate data management
├── services/
│   └── candidateService.js           # Service for API calls and data operations
└── README.md                         # This file
```

## Features

- **Candidate Table**: Display list of candidates with all key information
- **Search & Filters**: Search by name/role/college, filter by status/college/role
- **Candidate Details Drawer**: View complete candidate profile when clicking on a row
- **Status Management**: Update candidate status (Shortlisted/Rejected/Assessment/Interview)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading & Error States**: Proper UX for async operations

## Usage

The candidate management page is accessed via the `/candidates` route and is automatically rendered in the MainLayout.

### Example API Integration

To replace mock data with real API calls, update `services/candidateService.js`:

```javascript
export const candidateService = {
  getAllCandidates: async () => {
    const response = await fetch('/api/candidates');
    return response.json();
  },
  // ... other methods
};
```

## Component APIs

### useCandidates Hook
```javascript
const {
  candidates,           // Filtered candidates array
  allCandidates,        // Unfiltered candidates array
  loading,              // Loading state
  error,                // Error message
  filters,              // Current filter values
  updateFilter,         // Update filter function
  resetFilters,         // Reset all filters
  updateCandidateStatus, // Update candidate status
  getUniqueValues,      // Get unique values for filter dropdowns
  totalCandidates       // Total count of filtered candidates
} = useCandidates();
```

### CandidateDrawer Props
```javascript
<CandidateDrawer
  isOpen={boolean}
  candidate={candidateObject}
  onClose={function}
  onShortlist={function}
  onReject={function}
  isUpdating={boolean}
/>
```

## Styling

The module uses Tailwind CSS and matches the existing design system. All components maintain:
- Consistent color scheme (blue primary)
- Responsive layouts
- Proper spacing and typography
- Hover and interactive states

## Mock Data

Currently using mock data in `candidateService.js`. Replace with actual API endpoints when backend is ready.

### Mock Data Structure
```javascript
{
  id: number,
  name: string,
  college: string,
  role: string,
  score: number,
  status: 'Shortlisted' | 'Assessment' | 'Interview' | 'Rejected' | 'Offered',
  email: string,
  phone: string,
  location: string,
  gpa: string,
  degree: string,
  graduationYear: string,
  skills: string[],
  resume: string,
  feedback: string,
  avatar: string
}
```

## Future Enhancements

- Bulk actions (select multiple candidates)
- Export to CSV
- Advanced filters
- Sorting options
- Candidate comparison
- Email templates
- Integration with backend APIs
