import React from "react";
import { NavLink } from "react-router-dom";

export default function StudentSidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }) {
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
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          collapsed ? "md:w-[76px]" : "md:w-64"
        } w-64`}
        aria-label="Student navigation"
      >
        <div className={`p-3 ${collapsed ? "md:px-2" : "p-4"}`}>
          <div className={`mb-4 flex ${collapsed ? "justify-center" : "justify-end"}`}>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-lg leading-none">{collapsed ? "→" : "←"}</span>
            </button>
          </div>

          <div className="space-y-6">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {group.title && !collapsed && (
                  <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    {group.title}
                  </p>
                )}

                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    title={collapsed ? link.label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center rounded-lg text-sm font-medium transition ${
                        collapsed
                          ? "md:justify-center md:px-0 md:py-3"
                          : "gap-3 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <span className="shrink-0 text-base">{link.icon}</span>
                    <span className={collapsed ? "hidden" : ""}>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
