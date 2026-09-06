import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div
      style={{
        height: "60px",
        background: "#1e293b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        fontSize: "22px",
        fontWeight: "bold",
      }}
    >
      <span>Pragati Placement Portal</span>
      <ThemeToggle />
    </div>
  );
};

export default Navbar;