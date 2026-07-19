import React from "react";

const WeightValidationWidget = ({ total }) => {
  const isValid = total === 100;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.title}>Weight Distribution</h4>

        <span
          style={{
            ...styles.badge,
            background: isValid ? "#ECFDF5" : "#FEF2F2",
            color: isValid ? "#10B981" : "#EF4444",
          }}
        >
          {isValid ? "Valid" : "Invalid"}
        </span>
      </div>

      <h1
        style={{
          ...styles.total,
          color: isValid ? "#10B981" : "#EF4444",
        }}
      >
        {total}%
      </h1>

      <p
        style={{
          ...styles.message,
          color: isValid ? "#10B981" : "#EF4444",
        }}
      >
        {isValid
          ? "✓ Ready to Publish"
          : "Total weight must equal 100%"}
      </p>

      <div style={styles.progressBackground}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.min(total, 100)}%`,
            background: isValid ? "#10B981" : "#EF4444",
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "250px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
    zIndex: 1000,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  total: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "700",
  },

  message: {
    marginTop: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    fontWeight: "500",
  },

  progressBackground: {
    width: "100%",
    height: "10px",
    background: "#F1F5F9",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    transition: "width .3s ease",
  },
};

export default WeightValidationWidget;