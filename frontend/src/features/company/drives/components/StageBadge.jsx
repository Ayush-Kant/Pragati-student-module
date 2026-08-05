export const StageBadge = ({ stage }) => {
  const stageColors = {
    'Active': 'bg-blue-100 text-blue-700',
    'Assessment': 'bg-blue-100 text-blue-600',
    'Interview': 'bg-purple-100 text-purple-700',
    'Screening': 'bg-cyan-100 text-cyan-700',
    'Open': 'bg-emerald-100 text-emerald-700',
    'Upcoming': 'bg-amber-100 text-amber-700',
    'Completed': 'bg-indigo-100 text-indigo-700',
    'Closed': 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${stageColors[stage] || 'bg-gray-100 text-gray-700'}`}>
      {stage}
    </span>
  );
};
