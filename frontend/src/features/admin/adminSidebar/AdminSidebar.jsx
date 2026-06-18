// // // // // import {
// // // // //   FaHome,
// // // // //   FaBuilding,
// // // // //   FaSchool,
// // // // //   FaUsers,
// // // // //   FaUserTie,
// // // // //   FaRocket,
// // // // //   FaBell,
// // // // //   FaClipboardList,
// // // // // } from "react-icons/fa";

// // // // // function Sidebar() {
// // // // //   const menuItems = [
// // // // //     {
// // // // //       name: "Dashboard",
// // // // //       icon: <FaHome />,
// // // // //     },
// // // // //     {
// // // // //       name: "Companies",
// // // // //       icon: <FaBuilding />,
// // // // //     },
// // // // //     {
// // // // //       name: "Colleges",
// // // // //       icon: <FaSchool />,
// // // // //     },
// // // // //     {
// // // // //       name: "Students",
// // // // //       icon: <FaUsers />,
// // // // //     },
// // // // //     {
// // // // //       name: "Mentors",
// // // // //       icon: <FaUserTie />,
// // // // //     },
// // // // //     {
// // // // //       name: "Drives",
// // // // //       icon: <FaRocket />,
// // // // //     },
// // // // //     {
// // // // //       name: "Notifications",
// // // // //       icon: <FaBell />,
// // // // //     },
// // // // //     {
// // // // //       name: "Assessments",
// // // // //       icon: <FaClipboardList />,
// // // // //     },
// // // // //   ];

// // // // //   return (
// // // // //     <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 p-5">

// // // // //       {/* Logo */}
// // // // //       <div className="mb-10">
// // // // //         <h1 className="text-3xl font-bold text-center text-sky-400">
// // // // //           Pragati
// // // // //         </h1>
// // // // //       </div>

// // // // //       {/* Menu */}
// // // // //       <div className="flex flex-col gap-3">

// // // // //         {menuItems.map((item, index) => (
// // // // //           <button
// // // // //             key={index}
// // // // //             className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-700 transition-all duration-300"
// // // // //           >
// // // // //             <span className="text-lg">
// // // // //               {item.icon}
// // // // //             </span>

// // // // //             <span className="font-medium">
// // // // //               {item.name}
// // // // //             </span>
// // // // //           </button>
// // // // //         ))}

// // // // //       </div>
// // // // //     </div>
// // // // // //   );
// // // // // }

// // // // // export default Sidebar;
// // // // import {
// // // //   FaHome,
// // // //   FaBuilding,
// // // //   FaSchool,
// // // //   FaUsers,
// // // //   FaUserTie,
// // // //   FaClipboardList,
// // // //   FaBook,
// // // //   FaRocket,
// // // //   FaBell,
// // // //   FaGavel,
// // // // } from "react-icons/fa";
// // // // import logo from "../../../assets/logo.png";
// // // // function Sidebar() {
// // // //   const menuItems = [
// // // //     {
// // // //       title: "Dashboard",
// // // //       icon: <FaHome />,
// // // //     },
// // // //     {
// // // //       title: "Companies",
// // // //       icon: <FaBuilding />,
// // // //     },
// // // //     {
// // // //       title: "Colleges",
// // // //       icon: <FaSchool />,
// // // //     },
// // // //     {
// // // //       title: "Students",
// // // //       icon: <FaUsers />,
// // // //     },
// // // //     {
// // // //       title: "Mentors",
// // // //       icon: <FaUserTie />,
// // // //     },
// // // //     {
// // // //       title: "Assessments",
// // // //       icon: <FaClipboardList />,
// // // //     },
// // // //     {
// // // //       title: "Training",
// // // //       icon: <FaBook />,
// // // //     },
// // // //     {
// // // //       title: "Drives",
// // // //       icon: <FaRocket />,
// // // //     },
// // // //     {
// // // //       title: "Notifications",
// // // //       icon: <FaBell />,
// // // //     },
// // // //     {
// // // //       title: "Disputes",
// // // //       icon: <FaGavel />,
// // // //     },
// // // //   ];

// // // //   return (
// // // //     <aside  className={`
// // // //     fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 p-5 overflow-y-auto transition-transform duration-300

// // // //     ${openSidebar ? "translate-x-0" : "-translate-x-full"}

// // // //     md:translate-x-0
// // // //   `}>
// // // //       {/* Logo Section */}
// // // //       <div className="flex items-center gap-3 mb-10 pt-3">

// // // //   <img
// // // //     src={logo}
// // // //     alt="logo"
// // // //     className="h-12 w-auto"
// // // //   />

// // // //   {/* <div>
// // // //     <h1 className="text-2xl font-bold text-sky-600">
// // // //       Pragati
// // // //     </h1>

// // // //     <p className="text-sm text-gray-400">
// // // //       Admin Panel
// // // //     </p>
// // // //   </div> */}

// // // // </div>

// // // //       {/* Menu */}
// // // //       <div className="flex flex-col gap-2">

// // // //         {menuItems.map((item, index) => (
// // // //           <button
// // // //             key={index}
// // // //             className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left
// // // //             ${
// // // //               index === 0
// // // //                 ? "bg-sky-100 text-sky-600"
// // // //                 : "text-gray-600 hover:bg-gray-100"
// // // //             }`}
// // // //           >

// // // //             {/* Icon */}
// // // //             <div className="text-lg">
// // // //               {item.icon}
// // // //             </div>

// // // //             {/* Title */}
// // // //             <span className="font-medium text-sm">
// // // //               {item.title}
// // // //             </span>
// // // //           </button>
// // // //         ))}

// // // //       </div>
// // // //     </aside>
// // // //   );
// // // // }

// // // // export default Sidebar;
// // // import {
// // //   FaHome,
// // //   FaBuilding,
// // //   FaSchool,
// // //   FaUsers,
// // //   FaUserTie,
// // //   FaClipboardList,
// // //   FaBook,
// // //   FaRocket,
// // //   FaBell,
// // //   FaGavel,
// // // } from "react-icons/fa";

// // // import logo from "../../../assets/logo.png";

// // // function Sidebar({ openSidebar, setOpenSidebar }) {

// // //   const menuItems = [
// // //     { title: "Dashboard", icon: <FaHome /> },
// // //     { title: "Companies", icon: <FaBuilding /> },
// // //     { title: "Colleges", icon: <FaSchool /> },
// // //     { title: "Students", icon: <FaUsers /> },
// // //     { title: "Mentors", icon: <FaUserTie /> },
// // //     { title: "Assessments", icon: <FaClipboardList /> },
// // //     { title: "Training", icon: <FaBook /> },
// // //     { title: "Drives", icon: <FaRocket /> },
// // //     { title: "Notifications", icon: <FaBell /> },
// // //     { title: "Disputes", icon: <FaGavel /> },
// // //   ];

// // //   return (
// // //     <aside
// // //       className={`
// // //         fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 p-5 overflow-y-auto transition-transform duration-300

// // //         ${openSidebar ? "translate-x-0" : "-translate-x-full"}

// // //         md:translate-x-0
// // //       `}
// // //     >

// // //       {/* Logo */}
// // //      <div className="flex justify-center mb-4 pt-1">

// // //         <img
// // //           src={logo}
// // //           alt="logo"
// // //           className="h-12 w-auto"
// // //         />

// // //       </div>

// // //       {/* Menu */}
// // //       <div className="flex flex-col gap-2">

// // //         {menuItems.map((item, index) => (
// // //           <button
// // //             key={index}
// // //             className={`
// // //               flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left

// // //               ${
// // //                 index === 0
// // //                   ? "bg-sky-100 text-sky-600"
// // //                   : "text-gray-600 hover:bg-gray-100"
// // //               }
// // //             `}
// // //           >

// // //             <div className="text-lg">
// // //               {item.icon}
// // //             </div>

// // //             <span className="font-medium text-sm">
// // //               {item.title}
// // //             </span>

// // //           </button>
// // //         ))}

// // //       </div>

// // //     </aside>
// // //   );
// // // }

// // // export default Sidebar;
// // import {
// //   FaHome,
// //   FaBuilding,
// //   FaSchool,
// //   FaUsers,
// //   FaUserTie,
// //   FaClipboardList,
// //   FaBook,
// //   FaRocket,
// //   FaBell,
// //   FaGavel,
// // } from "react-icons/fa";

// // import logo from "../../../assets/logo.png";

// // function Sidebar({
// //   openSidebar,
// //   setOpenSidebar,
// //   darkMode,
// // }) {

// //   const menuItems = [
// //     { title: "Dashboard", icon: <FaHome /> },
// //     { title: "Companies", icon: <FaBuilding /> },
// //     { title: "Colleges", icon: <FaSchool /> },
// //     { title: "Students", icon: <FaUsers /> },
// //     { title: "Mentors", icon: <FaUserTie /> },
// //     { title: "Assessments", icon: <FaClipboardList /> },
// //     { title: "Training", icon: <FaBook /> },
// //     { title: "Drives", icon: <FaRocket /> },
// //     { title: "Notifications", icon: <FaBell /> },
// //     { title: "Disputes", icon: <FaGavel /> },
// //   ];

// //   return (
// //     <aside
// //       className={`
// //         fixed top-0 left-0 z-50 h-screen w-64
// //         p-5 overflow-y-auto border-r
// //         transition-all duration-300

// //         ${
// //           darkMode
// //             ? "bg-gray-900 border-gray-700"
// //             : "bg-white border-gray-200"
// //         }

// //         ${openSidebar ? "translate-x-0" : "-translate-x-full"}

// //         md:translate-x-0
// //       `}
// //     >

// //       {/* Logo */}
// //       <div className="flex justify-center mb-4 pt-1">

// //         <img
// //           src={logo}
// //           alt="logo"
// //           className="h-12 w-auto"
// //         />

// //       </div>

// //       {/* Menu */}
// //       <div className="flex flex-col gap-2">

// //         {menuItems.map((item, index) => (

// //           <button
// //             key={index}
// //             className={`
// //               flex items-center gap-4
// //               px-4 py-3 rounded-xl
// //               transition-all duration-300 text-left

// //               ${
// //                 index === 0
// //                   ? darkMode
// //                     ? "bg-gray-800 text-sky-400"
// //                     : "bg-sky-100 text-sky-600"
// //                   : darkMode
// //                     ? "text-gray-300 hover:bg-gray-800"
// //                     : "text-gray-600 hover:bg-gray-100"
// //               }
// //             `}
// //           >

// //             {/* Icon */}
// //             <div className="text-lg">
// //               {item.icon}
// //             </div>

// //             {/* Title */}
// //             <span className="font-medium text-sm">
// //               {item.title}
// //             </span>

// //           </button>

// //         ))}

// //       </div>

// //     </aside>
// //   );
// // }

// // export default 
// import {
//   FaHome,
//   FaBuilding,
//   FaSchool,
//   FaUsers,
//   FaUserTie,
//   FaClipboardList,
//   FaBook,
//   FaRocket,
//   FaBell,
//   FaGavel,
// } from "react-icons/fa";

// import logo from "../../../assets/logo.png";

// function AdminSidebar({
//   openSidebar,
//   setOpenSidebar,
//   darkMode,
// }) {

//   const menuSections = [

//     {
//       heading: "Overview",
//       items: [
//         {
//           title: "Dashboard",
//           icon: <FaHome />,
//         },
//       ],
//     },

//     {
//       heading: "Management",
//       items: [
//         {
//           title: "Companies",
//           icon: <FaBuilding />,
//         },
//         {
//           title: "Colleges",
//           icon: <FaSchool />,
//         },
//         {
//           title: "Students",
//           icon: <FaUsers />,
//         },
//         {
//           title: "Mentors",
//           icon: <FaUserTie />,
//         },
//       ],
//     },

//     {
//       heading: "Academics",
//       items: [
//         {
//           title: "Assessments",
//           icon: <FaClipboardList />,
//         },
//         {
//           title: "Training LMS",
//           icon: <FaBook />,
//         },
//       ],
//     },

//     {
//       heading: "Recruitment",
//       items: [
//         {
//           title: "Drives",
//           icon: <FaRocket />,
//         },
//       ],
//     },

//     {
//       heading: "Communications",
//       items: [
//         {
//           title: "Notifications",
//           icon: <FaBell />,
//         },
//         {
//           title: "Disputes",
//           icon: <FaGavel />,
//         },
//       ],
//     },

//   ];

//   return (
//     <aside
//       className={`
//         fixed top-0 left-0 z-50 h-screen w-64
//         p-5 overflow-y-auto border-r
//         transition-all duration-300

//         ${
//           darkMode
//             ? "bg-gray-900 border-gray-700"
//             : "bg-white border-gray-200"
//         }

//         ${openSidebar ? "translate-x-0" : "-translate-x-full"}

//         md:translate-x-0
//       `}
//     >

//       {/* Logo */}
//       <div className="flex justify-center mb-6 pt-1">

//         <img
//           src={logo}
//           alt="logo"
//           className="h-12 w-auto"
//         />

//       </div>

//       {/* Sections */}
//       {menuSections.map((section, sectionIndex) => (

//         <div key={sectionIndex} className="mb-6">

//           {/* Heading */}
//           <h2
//             className={`
//               text-xs uppercase font-semibold
//               mb-3 px-2 tracking-wide

//               ${
//                 darkMode
//                   ? "text-gray-500"
//                   : "text-gray-400"
//               }
//             `}
//           >
//             {section.heading}
//           </h2>

//           {/* Items */}
//           <div className="flex flex-col gap-2">

//             {section.items.map((item, index) => (

//               <button
//                 key={index}
//                 className={`
//                   flex items-center gap-4
//                   px-4 py-3 rounded-xl
//                   transition-all duration-300 text-left

//                   ${
//                     darkMode
//                       ? "text-gray-300 hover:bg-gray-800"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }
//                 `}
//               >

//                 {/* Icon */}
//                 <div className="text-lg">
//                   {item.icon}
//                 </div>

//                 {/* Title */}
//                 <span className="font-medium text-sm">
//                   {item.title}
//                 </span>

//               </button>

//             ))}

//           </div>

//         </div>

//       ))}

//     </aside>
//   );
// }

// export default AdminSidebar;
import {
  RiDashboardFill,
  RiBuilding2Fill,
  RiGraduationCapFill,
  RiTeamFill,
  RiUserStarFill,
  RiFileList3Fill,
  RiBook2Fill,
  RiRocket2Fill,
  RiNotification3Fill,
  RiAuctionFill,
  RiCloseLine,
} from "react-icons/ri";

import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";

function AdminSidebar({
  openSidebar,
  setOpenSidebar,
}) {
  const menuSections = [
    {
      heading: "Overview",
      items: [
        {
          title: "Dashboard",
          path: "/admin",
          icon: <RiDashboardFill />,
          color: "bg-[#19c79a]",
        },
      ],
    },

    {
      heading: "Management",
      items: [
        {
          title: "Companies",
          path: "/admin/companies",
          icon: <RiBuilding2Fill />,
          color: "bg-[#ff6b35]",
         
        },
        {
          title: "Colleges",
          path: "/admin/colleges",
          icon: <RiGraduationCapFill />,
          color: "bg-[#f4a300]",
          
        },
        {
          title: "Students",
          path: "/admin/students",
          icon: <RiTeamFill />,
          color: "bg-[#8b5cf6]",
        },
        {
          title: "Mentors",
          path: "/admin/mentors",
          icon: <RiUserStarFill />,
          color: "bg-[#0284c7]",
        },
      ],
    },

    {
      heading: "Academics",
      items: [
        {
          title: "Assessments",
          path: "/admin/assesments",
          icon: <RiFileList3Fill />,
          color: "bg-[#0f2857]",
        },
        {
          title: "Training (LMS)",
          path: "/admin/training",
          icon: <RiBook2Fill />,
          color: "bg-[#06b6d4]",
        },
      ],
    },

    {
      heading: "Recruitment",
      items: [
        {
          title: "Drives",
          path: "/admin/drives",
          icon: <RiRocket2Fill />,
          color: "bg-[#ff4d4f]",
        },
      ],
    },

    {
      heading: "Communications",
      items: [
        {
          title: "Notifications",
          path: "/admin/notification",
          icon: <RiNotification3Fill />,
          color: "bg-[#ec4899]",
        },
        {
          title: "Disputes",
          path: "/admin/disputes",
          icon: <RiAuctionFill />,
          color: "bg-[#6366f1]",
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        h-screen w-[270px]
        overflow-y-auto
        bg-[#f7f7f8]
        border-r border-gray-200
        transition-all duration-300

        ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Mobile Close */}
      <button
        onClick={() => setOpenSidebar(false)}
        className="
          md:hidden absolute top-5 right-5
          text-gray-500 text-2xl
        "
      >
        <RiCloseLine />
      </button>

      {/* Logo */}
      <div className="flex justify-start px-5 pt-4 pb-7">
        <img
          src={logo}
          alt="logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Menu */}
      <div className="px-3 pb-10">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-7">
            {/* Heading */}
            <h2
              className="
                text-[13px]
                uppercase
                font-bold
                tracking-wider
                text-[#9ca3af]
                mb-3
                px-2
              "
            >
              {section.heading}
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-1">
              {section.items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.title === "Dashboard"}
                  onClick={() => setOpenSidebar(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between
                    px-4 py-3
                    rounded-none
                    transition-all duration-300

                    ${
                      isActive
                        ? "bg-[#dff4fb]"
                        : "hover:bg-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`
                            h-9 w-9
                            rounded-xl
                            flex items-center justify-center
                            text-white text-[18px]
                            ${item.color}
                          `}
                        >
                          {item.icon}
                        </div>

                        {/* Title */}
                        <span
                          className={`
                            text-[17px]
                            font-medium
                            ${
                              isActive
                                ? "text-[#4b5563]"
                                : "text-[#4b5563]"
                            }
                          `}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="
                            min-w-[24px]
                            h-6
                            px-2
                            rounded-full
                            bg-[#ff6b35]
                            text-white
                            text-[12px]
                            font-semibold
                            flex items-center justify-center
                          "
                        >
                          {item.badge}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;