// // import {
// //   FaBell,
// //   FaCog,
// //   FaSearch,
// //   FaBars,
// // } from "react-icons/fa";
// // import logo from "../../../assets/logo.png";
// // function Navbar({ openSidebar, setOpenSidebar })  {
// //   return (
// //     <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-50">

// //       {/* LEFT SECTION */}
// //       <div className="flex items-center gap-3">

// //         {/* Hamburger */}
// //         <button
// //           onClick={() => setOpenSidebar(!openSidebar)}
// //           className="md:hidden text-gray-700 text-2xl"
// //         >
// //           <FaBars />
// //         </button>

    
// //       </div>

// //       {/* SEARCH BAR */}
// //       <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-[350px] border border-gray-200">
        
// //         <FaSearch className="text-gray-400 mr-2" />

// //         <input
// //           type="text"
// //           placeholder="Search..."
// //           className="bg-transparent outline-none text-sm w-full"
// //         />
// //       </div>

// //       {/* RIGHT SECTION */}
// //       <div className="flex items-center gap-3 md:gap-5">

// //         {/* Notification */}
// //         <button className="relative text-gray-600 hover:text-sky-500 text-lg">
// //           <FaBell />

// //           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
// //         </button>

// //         {/* Settings */}
// //         <button className="text-gray-600 hover:text-sky-500 text-lg hidden sm:block">
// //           <FaCog />
// //         </button>

// //         {/* Enterprise Button */}
// //         <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full font-medium transition">
// //           For Enterprise
// //         </button>

// //         {/* Profile */}
// //         <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold cursor-pointer">
// //           AD
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }


// // export default Navbar;4
// import {
//   FaBell,
//   FaCog,
//   FaSearch,
//   FaBars,
// } from "react-icons/fa";

// function Navbar({ openSidebar, setOpenSidebar }) {

//   return (
//     <header className="fixed top-0 md:left-64 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-40">

//       {/* Left */}
//       <div className="flex items-center gap-3">

//         <button
//           onClick={() => setOpenSidebar(!openSidebar)}
//           className="md:hidden text-gray-700 text-2xl"
//         >
//           <FaBars />
//         </button>

//       </div>

//       {/* Search */}
//       <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-[350px] border border-gray-200">

//         <FaSearch className="text-gray-400 mr-2" />

//         <input
//           type="text"
//           placeholder="Search..."
//           className="bg-transparent outline-none text-sm w-full"
//         />
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-4">

//         <button className="relative text-gray-600 hover:text-sky-500">
//           <FaBell />

//           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         <button className="text-gray-600 hover:text-sky-500 hidden sm:block">
//           <FaCog />
//         </button>

//         <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full">
//           For Enterprise
//         </button>

//         <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
//           AD
//         </div>

//       </div>
//     </header>
//   );
// }

// export default Navbar;

import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa";


function AdminNavbar({
  openSidebar,
  setOpenSidebar,
  darkMode,
  setDarkMode,
  profile
}) {
  const navigate = useNavigate();
  const initials =
    profile?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "AD";
  return (
    <header
      className={`
        fixed top-0 md:left-64 left-0 right-0 h-16
        flex items-center justify-between
        px-4 md:px-6 z-50 border-b transition-all duration-300

        ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }
      `}
    >

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Hamburger */}
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className={`
            md:hidden text-2xl transition
            ${darkMode ? "text-white" : "text-gray-700"}
          `}
        >
          <FaBars />
        </button>

      </div>

      {/* SEARCH */}
      <div
        className={`
          hidden md:flex items-center px-4 py-2 rounded-full
          w-[350px] border transition-all duration-300

          ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-100 border-gray-200"
          }
        `}
      >

        <FaSearch
          className={darkMode ? "text-gray-400 mr-2" : "text-gray-400 mr-2"}
        />

        <input
          type="text"
          placeholder="Search..."
          className={`
            bg-transparent outline-none text-sm w-full

            ${
              darkMode
                ? "text-white placeholder:text-gray-400"
                : "text-black"
            }
          `}
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`
            text-xl transition

            ${
              darkMode
                ? "text-yellow-400"
                : "text-gray-600"
            }
          `}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notification */}
        <button
          className={`
            relative transition

            ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-sky-500"
            }
          `}
        >
          <FaBell />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Enterprise */}
        <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full">
          For Enterprise
        </button>

        {/* Profile */}
         <div
  onClick={() => navigate("/admin/profile")}
  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold cursor-pointer"
>
  {initials}
</div>

      </div>
    </header>
  );
}

export default AdminNavbar;