const StatCard = ({ title, value }) => {
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
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(59,130,246,0.05)",
        minHeight: "140px",
        textAlign: "center",
        transform: "translateY(0px)",
        transition: "all 0.25s ease",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        borderTop: "4px solid #3b82f6",
      }}
    >
      <h3
        style={{
          color: "#6b7280",
          fontSize: "16px",
          marginBottom: "14px",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "40px",
          fontWeight: "700",
          color: "#3b82f6",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default StatCard;
