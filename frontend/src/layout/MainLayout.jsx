import Sidebar from "../features/company/sidebar/components/Sidebar";
import Navbar from "../features/company/navbar/components/Navbar";

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
  style={{
    marginLeft: "280px",
    marginTop: "68px",   /* clear the fixed 68px navbar */
    padding: "12px 24px 24px",
    flex: 1,
    minHeight: "calc(100vh - 68px)",
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