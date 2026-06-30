import { useState } from "react";
import { FaBell, FaCog, FaUserCircle } from "react-icons/fa";

function Header() {
  const [message, setMessage] = useState("");

  const handleNotification = () => {
    setMessage("Notifications opened");
  };

  const handleSettings = () => {
    setMessage("Settings opened");
  };

  const handleProfile = () => {
    setMessage("Profile opened");
  };

  return (
    <>
      <header className="header">
        {/* LEFT */}
        <div className="logo-section">
          <div className="logo-box">P</div>

          {/* Laptop + ipad pe Pragati dikhega */}
          <h2 className="logo-text">Pragati</h2>
        </div>

        {/* SEARCH */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search candidates, drives, assessments..."
            className="search-bar"
          />
        </div>

        {/* BUTTONS */}
        <div className="button-section">
          <button onClick={handleNotification} className="icon-btn">
            <FaBell />
          </button>

          <button onClick={handleSettings} className="icon-btn">
            <FaCog />
          </button>

          <button onClick={handleProfile} className="icon-btn">
            <FaUserCircle />
          </button>
        </div>
      </header>

      {message && <p className="message">{message}</p>}
    </>
  );
}

export default Header;