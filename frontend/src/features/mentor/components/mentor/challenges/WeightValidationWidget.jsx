import React from "react";

const WeightValidationWidget = ({ total }) => {
  const isValid = total === 100;

  return (
    <div
      style={{
        position: "fixed",

        bottom: "25px",
        right: "25px",
        background: "#FFFFFF",
        borderRadius: "14px",
        padding: "18px",
        minWidth: "220px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        border: "1px solid #E5E7EB",
        zIndex: 999,

      }}
    >
      <h4
        style={{
          margin: "0 0 10px",
          color: "#374151",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Weight Distribution
      </h4>

      <h2
        style={{
          margin: "0",
          fontSize: "32px",
          fontWeight: "700",
          color: isValid ? "#10B981" : "#EF4444",
        }}
      >
        {total}%
      </h2>

      <p
        style={{
          marginTop: "10px",
          color: isValid ? "#10B981" : "#EF4444",
          fontWeight: "500",
        }}
      >
        {isValid
          ? "✓ Ready to Publish"
          : "Total weight must be exactly 100%"}
      </p>

      {/* Progress Bar */}
      <div
        style={{
          marginTop: "12px",
          width: "100%",
          height: "8px",
          background: "#E5E7EB",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(total, 100)}%`,
            height: "100%",
            background: isValid ? "#10B981" : "#EF4444",
            transition: "0.3s ease",
          }}
        />
      </div>
=======
        bottom: "20px",
        right: "20px",
        background: isValid ? "#10B981" : "#EF4444",
        color: "white",
        padding: "10px 15px",
        borderRadius: "8px",
      
  
      Weight: {total}%


    
    
      <h4
        style={{
          margin: "0 0 10px",
          color: "#374151",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Weight Distribution
      </h4>

      <h2
        style={{
          margin: "0",
          fontSize: "32px",
          fontWeight: "700",
          color: isValid ? "#10B981" : "#EF4444",
        }}
      >
        {total}%
      </h2>

      <p
        style={{
          marginTop: "10px",
          color: isValid ? "#10B981" : "#EF4444",
          fontWeight: "500",
        }}
      >
        {isValid
          ? "✓ Ready to Publish"
          : "Total weight must be exactly 100%"}
      </p>

      {/* Progress Bar */}
      <div
        style={{
          marginTop: "12px",
          width: "100%",
          height: "8px",
          background: "#E5E7EB",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(total, 100)}%`,
            height: "100%",
            background: isValid ? "#10B981" : "#EF4444",
            transition: "0.3s ease",
          }}
        />
      </div>

    </div>
  );
};

export default WeightValidationWidget;