import "./../styles/quickActions.css";

const actions = [
  {
    label: "Create Drive",
    className: "blue-btn",
  },
  {
    label: "Schedule Interview",
    className: "green-btn",
  },
  {
    label: "Send Notification",
    className: "orange-btn",
  },
  {
    label: "Export Candidates",
    className: "purple-btn",
  },
];

const QuickActions = () => {
  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h2>Quick Actions</h2>
      </div>

      <div className="quick-actions-list">
        {actions.map((action, index) => (
          <button
            key={index}
            className={action.className}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;