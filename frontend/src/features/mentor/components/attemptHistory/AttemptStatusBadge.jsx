/**
 * AttemptStatusBadge — Displays status label with corresponding UptoSkills theme colors
 */
export default function AttemptStatusBadge({ status }) {
  const normalized = status?.toLowerCase() || '';

  let bg = '#F1F5F9';
  let color = '#6B7280';
  let label = 'Unknown';

  if (normalized === 'passed' || normalized === 'success') {
    bg = '#ECFDF5';
    color = '#10B981';
    label = 'Passed';
  } else if (normalized === 'failed' || normalized === 'danger') {
    bg = '#FEF2F2';
    color = '#EF4444';
    label = 'Failed';
  } else if (normalized === 'in-progress' || normalized === 'warning') {
    bg = '#FFF7ED';
    color = '#F97316';
    label = 'In Progress';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: bg,
      color: color,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
