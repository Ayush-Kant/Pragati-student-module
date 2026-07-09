export const TrainingStatusBadge = ({ status }) => {
  const statusStyles = {
    Active: 'bg-cyan-50 text-cyan-600',
    Completed: 'bg-green-50 text-green-600',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
};
