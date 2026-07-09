import React from "react";
import CollegeSidebar from "../../../components/CollegeSidebar";

const MobileSidebar = ({
  openSidebar,
  setOpenSidebar,
  darkMode,
}) => {
  if (!openSidebar) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => setOpenSidebar(false)}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-50 md:hidden">
        <CollegeSidebar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          darkMode={darkMode}
        />
      </div>
    </>
  );
};

export default MobileSidebar;