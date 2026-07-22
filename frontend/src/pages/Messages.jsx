const Messages = () => {
  return (
    <div
      style={{
        background: "#f5f6fa",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "8px",
          }}
        >
          Communication Center
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          Send notifications and messages to candidates
        </p>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        {/* RECIPIENTS */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Recipients
          </label>

          <select
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
            }}
          >
            <option>All Candidates</option>
            <option>Shortlisted Candidates</option>
            <option>Interview Scheduled</option>
            <option>Offer Accepted</option>
            <option>Custom Selection</option>
          </select>
        </div>

        {/* SEND VIA + TEMPLATE */}
        <div
          style={{
            display: "flex",
            gap: "25px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* SEND VIA */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Send Via
            </label>

            <div style={{ display: "flex", gap: "20px" }}>
              <label>
                <input type="checkbox" defaultChecked /> Email
              </label>

              <label>
                <input type="checkbox" /> SMS
              </label>

              <label>
                <input type="checkbox" /> In-App
              </label>
            </div>
          </div>

          {/* TEMPLATE */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Template
            </label>

            <select
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
              }}
            >
              <option>Custom Message</option>
              <option>Interview Invitation</option>
              <option>Assessment Reminder</option>
              <option>Offer Letter</option>
              <option>Rejection Notice</option>
            </select>
          </div>
        </div>

        {/* SUBJECT */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Subject
          </label>

          <input
            type="text"
            placeholder="Enter email subject..."
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
            }}
          />
        </div>

        {/* MESSAGE */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Message
          </label>

          {/* TOOLBAR */}
          <div
            style={{
              border: "1px solid #d1d5db",
              borderBottom: "none",
              padding: "12px",
              background: "#f9fafb",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              display: "flex",
              gap: "18px",
            }}
          >
            <span><b>B</b></span>
            <span><i>I</i></span>
            <span><u>U</u></span>
            <span>Link</span>
            <span>List</span>
          </div>

          <textarea
            rows="8"
            placeholder="Compose your message here..."
            style={{
              width: "100%",
              padding: "16px",
              border: "1px solid #d1d5db",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              resize: "none",
              fontSize: "15px",
            }}
          ></textarea>

          <p
            style={{
              marginTop: "12px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            You can use the following placeholders:
            {" {candidate_name}, {position}, {interview_date}, {company_name}"}
          </p>
        </div>

        {/* BUTTON */}
        <div style={{ textAlign: "right" }}>
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;