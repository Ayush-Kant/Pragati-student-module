export const StatusBadge = ({ status }) => {
  const statusStyles = {
    Shortlisted: 'bg-blue-100 text-blue-600',
    Assessment: 'bg-blue-50 text-blue-600',
    Interview: 'bg-purple-50 text-purple-600',
    Rejected: 'bg-red-50 text-red-600',
    Offered: 'bg-green-50 text-green-600'
  };

  const styles = statusStyles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${styles}`}>
      {status}
    </span>
  );
};
