const ProgressLegend = () => {
  const items = [
    { label: "DSA", value: "40%" },
    { label: "Projects", value: "30%" },
    { label: "Resume", value: "20%" },
    { label: "Aptitude", value: "10%" },
  ];

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
        width: "260px",
        border: "1px solid #e5e7eb",
        borderTop: "4px solid #3b82f6",
        transition: "all 0.25s ease",
        transform: "translateY(0px)",
        cursor: "pointer",
      }}
    >
      <h3
        style={{
          marginBottom: "22px",
          color: "#111827",
          fontSize: "20px",
          fontWeight: "600",
          letterSpacing: "-0.5px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Skills Breakdown
      </h3>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#e5e7eb",
              borderRadius: "999px",
            }}
          >
            <div
              style={{
                width: item.value,
                height: "100%",
                background: "#3b82f6",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressLegend;
