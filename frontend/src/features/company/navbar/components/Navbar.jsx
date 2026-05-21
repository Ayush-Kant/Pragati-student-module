import "./../styles/navbar.css";

import {
  FiBell,
  FiSettings,
  FiSearch,
} from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          P
        </div>

        <h2>Pragati</h2>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FiSearch
            size={16}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="nav-icon">
          <FiBell size={18} />
        </div>

        <div className="nav-icon">
          <FiSettings size={18} />
        </div>

        <div className="profile-circle">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;