const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>Menu</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "20px 0" }}>Dashboard</li>
        <li style={{ margin: "20px 0" }}>Students</li>
        <li style={{ margin: "20px 0" }}>Placement</li>
        <li style={{ margin: "20px 0" }}>Analytics</li>
        <li style={{ margin: "20px 0" }}>Reports</li>
      </ul>
    </div>
  );
};

export default Sidebar;