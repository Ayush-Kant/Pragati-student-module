export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export const formatRemainingTime = (deadlineStr) => {
  if (!deadlineStr) return '';
  const date = new Date(deadlineStr);
  if (isNaN(date.getTime())) return deadlineStr;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'Overdue';

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d left`;
  }
  return `${diffHours}h left`;
};

export const formatXP = (xp) => {
  if (xp === undefined || xp === null) return '0';
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
};

export const getActivityTypeStyles = (type) => {
  switch (type?.toUpperCase()) {
    case 'EXAM':
      return {
        bg: 'rgba(239, 68, 68, 0.1)',
        text: 'text-red-400',
        border: 'border-red-500/20',
        iconColor: '#EF4444'
      };
    case 'ASSIGNMENT':
      return {
        bg: 'rgba(245, 158, 11, 0.1)',
        text: 'text-amber-400',
        border: 'border-amber-500/20',
        iconColor: '#F59E0B'
      };
    case 'CLASS':
      return {
        bg: 'rgba(79, 70, 229, 0.1)',
        text: 'text-indigo-400',
        border: 'border-indigo-500/20',
        iconColor: '#4F46E5'
      };
    case 'STUDY_SESSION':
      return {
        bg: 'rgba(6, 182, 212, 0.1)',
        text: 'text-cyan-400',
        border: 'border-cyan-500/20',
        iconColor: '#06B6D4'
      };
    default:
      return {
        bg: 'rgba(156, 163, 175, 0.1)',
        text: 'text-gray-400',
        border: 'border-gray-500/20',
        iconColor: '#9CA3AF'
      };
  }
};
