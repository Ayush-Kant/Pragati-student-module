const ActiveDriveCard = () => {
  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        padding: "22px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(59,130,246,0.05)",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid #e5e7eb",
        borderTop: "4px solid #3b82f6",
        transition: "all 0.25s ease",
        transform: "translateY(0px)",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "#dcfce7",
          color: "#16a34a",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "18px",
        }}
      >
        Active Drive
      </div>

      <h2
        style={{
          margin: "0 0 10px 0",
          fontSize: "24px",
          color: "#111827",
        }}
      >
        Google
      </h2>

      <p style={{ color: "#4b5563", marginBottom: "10px" }}>
        Role: <strong>SDE Intern</strong>
      </p>

      <p style={{ color: "#4b5563", marginBottom: "10px" }}>
        Package: <strong>12 LPA</strong>
      </p>

      <p style={{ color: "#4b5563", marginBottom: "20px" }}>
        Deadline: <strong>20 June</strong>
      </p>

      <button
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
        style={{
          background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%",
          boxShadow: "0 6px 14px rgba(37,99,235,0.3)",
          transition: "0.3s",
        }}
      >
        Apply Now
      </button>
    </div>
  );
};

export default ActiveDriveCard;
