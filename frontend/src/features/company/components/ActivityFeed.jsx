import "./../styles/activityFeed.css";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed-card">
      <div className="card-header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-list">
        {activities.map((activity, index) => (
          <div
            className="activity-item"
            key={index}
          >
            <div className="activity-avatar">
              {activity.initials}
            </div>

            <div className="activity-content">
              <p>{activity.message}</p>

              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;