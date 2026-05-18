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
            marginTop: "80px",
            padding: "24px",
            width: "100%",
            minHeight: "100vh",
            background: "#F8FAFC",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;