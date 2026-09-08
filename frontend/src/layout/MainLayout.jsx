import Sidebar from "../features/company/sidebar/components/Sidebar";
import Navbar from "../features/company/navbar/components/Navbar";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

import { useTheme } from "../context/ThemeContext";

const MainLayout = () => {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "dark bg-[#0b0f19] text-white" : "bg-[#F8FAFC] text-slate-900"}>
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <main
          className="main-content"
          style={{
            marginLeft: "280px",
            marginTop: "68px",
            padding: "24px",
            flex: 1,
            minHeight: "100vh",
            background: isDark ? "#0b0f19" : "#F8FAFC",
            color: isDark ? "#f8fafc" : "#0f172a",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;