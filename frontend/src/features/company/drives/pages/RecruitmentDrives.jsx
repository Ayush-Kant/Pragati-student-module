import { useState } from 'react';
import { DrivesHeader } from '../components/DrivesHeader';
import { DriveFilters } from '../components/DriveFilters';
import { DrivesTable } from '../components/DrivesTable';
import { CreateDriveDrawer } from '../components/CreateDriveDrawer';

export const RecruitmentDrives = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    year: '',
  });

  // Sample data
  const drivesData = [
    {
      id: 1,
      driveName: 'Software Engineer - 2026',
      role: 'Software Engineer',
      candidates: 245,
      stage: 'Active',
      deadline: 'Jun 15, 2026',
    },
    {
      id: 2,
      driveName: 'Data Analyst Drive',
      role: 'Data Analyst',
      candidates: 167,
      stage: 'Assessment',
      deadline: 'Jun 20, 2026',
    },
    {
      id: 3,
      driveName: 'Product Manager Hiring',
      role: 'Product Manager',
      candidates: 89,
      stage: 'Interview',
      deadline: 'Jun 25, 2026',
    },
    {
      id: 4,
      driveName: 'UI/UX Designer - Campus',
      role: 'UI/UX Designer',
      candidates: 134,
      stage: 'Screening',
      deadline: 'Jul 1, 2026',
    },
    {
      id: 5,
      driveName: 'DevOps Engineer',
      role: 'DevOps Engineer',
      candidates: 76,
      stage: 'Active',
      deadline: 'Jul 5, 2026',
    },
  ];

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getUniqueValues = (key) => {
    const values = drivesData.map(drive => drive[key]);
    return [...new Set(values)];
  };

  const filteredDrives = drivesData.filter(drive => {
    const matchSearch = drive.driveName.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || drive.stage === filters.status;
    const matchDepartment = !filters.department || drive.role === filters.department;
    // For year filter, you would add year to your data
    const matchYear = !filters.year || true;
    return matchSearch && matchStatus && matchDepartment && matchYear;
  });

  return (
    <div className="flex-1 overflow-auto">
      <div>
        <DrivesHeader onCreateClick={() => setIsDrawerOpen(true)} />
        <DriveFilters
          filters={filters}
          updateFilter={updateFilter}
          getUniqueValues={getUniqueValues}
        />
        <DrivesTable drives={filteredDrives} />
      </div>

      <CreateDriveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
