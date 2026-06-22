import React from 'react';

const activityTypes = [
  { id: 'assignment', name: 'Assignment', description: 'Task to be completed and submitted' },
  { id: 'quiz', name: 'Quiz / Assessment', description: 'Test knowledge with questions' },
  { id: 'coding', name: 'Practice Task', description: 'Hands-on practice activity' },
  { id: 'session', name: 'Session Activity', description: 'Slides or live session activity' },
  { id: 'career', name: 'Career Activity', description: 'Career development task' },
  { id: 'resource', name: 'Resource', description: 'Reading or learning material' },
];

const ActivityTypePicker = ({ onSelect, selectedType }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-gray-800">Activity Types</h3>
      <div className="mt-4 space-y-4">
        {activityTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`p-3 border rounded-lg cursor-pointer ${selectedType === type.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <h4 className="font-medium text-gray-900">{type.name}</h4>
            <p className="text-sm text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTypePicker;
