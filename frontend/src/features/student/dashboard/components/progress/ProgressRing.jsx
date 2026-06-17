const ProgressRing = () => {
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
        padding: "30px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(37,99,235,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "260px",
        border: "1px solid #e5e7eb",
        borderTop: "5px solid #2563eb",
        transition: "all 0.25s ease",
        transform: "translateY(0px)",
        cursor: "pointer",
      }}
    >
      <h2
        style={{
          marginBottom: "24px",
          color: "#111827",
          fontSize: "20px",
          fontWeight: "600",
          letterSpacing: "-0.5px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Profile Completion
      </h2>

      <div
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "conic-gradient(#2563eb 0% 75%, #dbeafe 75% 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          75%
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
