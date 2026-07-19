export const StageBadge = ({ stage }) => {
  const stageColors = {
    'Active': 'bg-blue-100 text-blue-700',
    'Assessment': 'bg-blue-100 text-blue-600',
    'Interview': 'bg-purple-100 text-purple-700',
    'Screening': 'bg-cyan-100 text-cyan-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${stageColors[stage] || 'bg-gray-100 text-gray-700'}`}>
      {stage}
    </span>
  );
};
