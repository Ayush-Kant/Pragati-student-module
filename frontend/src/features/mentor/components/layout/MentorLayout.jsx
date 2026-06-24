import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  ListTodo,
  LineChart,
  Settings,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";

export default function MentorLayout() {
  const navigate = useNavigate();

  const menuItems = [
  {
    name: "Dashboard",
    path: "/mentor/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "My Mentees",
    path: "/mentor/mentees",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Sessions",
    path: "/mentor/sessions",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    name: "Assessments",
    path: "/mentor/assessments",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    name: "Tasks & Assignments",
    path: "/mentor/tasks",
    icon: <ListTodo className="w-5 h-5" />,
  },
  {
    name: "Reports & Analytics",
    path: "/mentor/export-report",
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/mentor/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

  const [{ mentorName, initials }] = useState(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          mentorName: "Mentor User",
          initials: "MU",
        };
      }

      const decoded = jwtDecode(token);

      if (decoded.name) {
        return {
          mentorName: decoded.name,
          initials: decoded.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
        };
      }

      if (decoded.email) {
        const emailName = decoded.email.split("@")[0];

        const formattedName =
          emailName.charAt(0).toUpperCase() +
          emailName.slice(1).replace(/[^a-zA-Z0-9]/g, " ");

        return {
          mentorName: formattedName,
          initials: formattedName.substring(0, 2).toUpperCase(),
        };
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }

    return {
      mentorName: "Mentor User",
      initials: "MU",
    };
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: '"Inter", sans-serif',
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* 1. FIXED LEFT SIDEBAR */}
      <div
        style={{
          width: "260px",
          height: "100vh",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          boxSizing: "border-box",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px",
            paddingLeft: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#0ea5e9",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "800",
            }}
          >
            U
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.03em",
            }}
          >
            UPTOSKILLS
          </span>
        </div>

        {/* Menu Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {console.log("Clicked:", item);navigate(item.path)}}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: item.active ? "#f0f9ff" : "transparent",
                color: item.active ? "#0284c7" : "#64748b",
                fontWeight: item.active ? "600" : "500",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              {item.icon}
              {item.name}
            </div>
          ))}
        </div>

        {/* Support Vector Box */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <div className="flex justify-center mb-2">
            <HelpCircle className="w-8 h-8 text-sky-500" />
          </div>
          <h4
            style={{
              margin: "6px 0 2px 0",
              fontSize: "13px",
              color: "#0f172a",
              fontWeight: "700",
            }}
          >
            Need Help?
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#64748b",
              marginBottom: "10px",
            }}
          >
            Our Support Desk is open
          </p>
          <button
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#0ea5e9",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Support
          </button>
        </div>
      </div>

      {/* 2. RIGHT SIDE CONTENT CANVAS */}
      <div
        style={{
          flex: 1,
          marginLeft: "260px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top Header Navigation Bar */}
        <div
          style={{
            height: "70px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            boxSizing: "border-box",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          {/* Mockup Search */}
          <div style={{ position: "relative", width: "320px" }}>
            <input
              type="text"
              placeholder="Search for opportunities, profiles, faqs..."
              style={{
                width: "100%",
                padding: "10px 16px 10px 38px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "10px",
                color: "#94a3b8",
              }}
            >
              <Search className="w-4 h-4 mt-0.5" />
            </span>
          </div>

          {/* User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ cursor: "pointer", color: "#64748b" }}>
              <Bell className="w-5 h-5" />
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#0ea5e9",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                {initials}
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#1e293b",
                    lineHeight: "1.2",
                  }}
                >
                  {mentorName}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  Mentor Console
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inner Content Injection Frame */}
        <div
          style={{
            padding: "32px 40px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
