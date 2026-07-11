import Sidebar from "../features/company/sidebar/components/Sidebar";
import Navbar from "../features/company/navbar/components/Navbar";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
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
    background: "#F8FAFC",
    boxSizing: "border-box",
    overflowX: "hidden",
  }}
>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;