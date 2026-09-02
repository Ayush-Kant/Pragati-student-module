import React from "react";
import { NavLink } from "react-router-dom";

export default function StudentSidebar({ isOpen, onClose }) {
  const navGroups = [
    {
      title: null,
      links: [{ to: "/student/dashboard", label: "Dashboard", icon: "📊" }],
    },
    {
      title: "LEARN",
      links: [
        { to: "/student/courses", label: "Courses", icon: "📚" },
        { to: "/student/sessions", label: "Live Sessions", icon: "🎥" },
        { to: "/student/assignments", label: "Assignments", icon: "📝" },
        { to: "/student/assessments", label: "Assessments", icon: "✍️" },
        { to: "/student/coding-challenges", label: "Coding Challenges", icon: "💻" },
        { to: "/student/projects", label: "Projects", icon: "🚀" },
      ],
    },
    {
      title: "CAREER",
      links: [
        { to: "/student/performance", label: "Performance", icon: "📈" },
        { to: "/student/interviews", label: "Interviews", icon: "💼" },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { to: "/student/profile", label: "Profile", icon: "👤" },
        { to: "/student/notifications", label: "Notifications", icon: "🔔" },
        { to: "/student/certificates", label: "Certificates", icon: "📜" },
      ],
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.title && (
                <p className="px-3 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                  {group.title}
                </p>
              )}

              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
