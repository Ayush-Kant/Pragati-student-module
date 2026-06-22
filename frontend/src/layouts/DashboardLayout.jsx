import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main
          style={{
            padding: "20px",
            width: "100%",
            background: "#f1f5f9",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;