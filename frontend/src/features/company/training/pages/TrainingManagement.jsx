import { useState } from 'react';
import { TrainingHeader } from '../components/TrainingHeader';
import { TrainingAnalyticsCards } from '../components/TrainingAnalyticsCards';
import { TrainingFilters } from '../components/TrainingFilters';
import { TrainingTable } from '../components/TrainingTable';

export const TrainingManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    mentor: '',
    status: '',
  });

  // Sample training data
  const trainingData = [
    {
      id: 1,
      program: 'Full Stack Development Bootcamp',
      mentor: 'Priya Sharma',
      mentorInitials: 'PS',
      students: 45,
      completion: '87%',
      attendance: '92%',
      status: 'Active',
    },
    {
      id: 2,
      program: 'Data Science Fundamentals',
      mentor: 'Vikram Singh',
      mentorInitials: 'VS',
      students: 38,
      completion: '76%',
      attendance: '88%',
      status: 'Active',
    },
    {
      id: 3,
      program: 'Product Management Workshop',
      mentor: 'Anjali Desai',
      mentorInitials: 'AD',
      students: 28,
      completion: '94%',
      attendance: '95%',
      status: 'Completed',
    },
    {
      id: 4,
      program: 'UI/UX Design Sprint',
      mentor: 'Meera Iyer',
      mentorInitials: 'MI',
      students: 32,
      completion: '82%',
      attendance: '90%',
      status: 'Active',
    },
    {
      id: 5,
      program: 'Cloud & DevOps Training',
      mentor: 'Ravi Patel',
      mentorInitials: 'RP',
      students: 25,
      completion: '68%',
      attendance: '85%',
      status: 'Active',
    },
  ];

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const getUniqueValues = (key) => {
    const values = trainingData.map(program => program[key]);
    return [...new Set(values)];
  };

  const filteredPrograms = trainingData.filter(program => {
    const matchSearch = program.program.toLowerCase().includes(filters.search.toLowerCase());
    const matchMentor = !filters.mentor || program.mentor === filters.mentor;
    const matchStatus = !filters.status || program.status === filters.status;
    return matchSearch && matchMentor && matchStatus;
  });

  const handleMenuClick = (program, action) => {
    // Handle menu click with action type
    // Can be extended for drawer/modal functionality based on action
    console.log('Menu action:', action, 'for program:', program);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div>
        <TrainingHeader />
        <TrainingAnalyticsCards />
        <TrainingFilters
          filters={filters}
          updateFilter={updateFilter}
          getUniqueValues={getUniqueValues}
        />
        <TrainingTable
          programs={filteredPrograms}
          onMenuClick={handleMenuClick}
        />
      </div>
    </div>
  );
};
