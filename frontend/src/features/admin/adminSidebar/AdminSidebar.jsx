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
  FaHome,
  FaBuilding,
  FaSchool,
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaBook,
  FaRocket,
  FaBell,
  FaGavel,
   FaTimes,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import logo from "../../../assets/logo.png";

function AdminSidebar({
  openSidebar,
  setOpenSidebar,
  darkMode,
}) {

  const menuSections = [

    {
      heading: "Overview",
      items: [
        {
          title: "Dashboard",
          path: "/admin",
          icon: <FaHome />,
        },
      ],
    },

    {
      heading: "Management",
      items: [
        {
          title: "Companies",
          path: "/admin/companies",
          icon: <FaBuilding />,
        },
        {
          title: "Colleges",
          path: "/admin/colleges",
          icon: <FaSchool />,
        },
        {
          title: "Students",
          path: "/admin/students",
          icon: <FaUsers />,
        },
        {
          title: "Mentors",
          path: "/admin/mentors",
          icon: <FaUserTie />,
        },
      ],
    },

    {
      heading: "Academics",
      items: [
        {
          title: "Assessments",
          path: "/admin/assesments",
          icon: <FaClipboardList />,
        },
        {
          title: "Training LMS",
          path: "/admin/training",
          icon: <FaBook />,
        },
      ],
    },

    {
      heading: "Recruitment",
      items: [
        {
          title: "Drives",
          path: "/admin/drives",
          icon: <FaRocket />,
        },
      ],
    },

    {
      heading: "Communications",
      items: [
        {
          title: "Notifications",
          path: "/admin/notification",
          icon: <FaBell />,
        },
        {
          title: "Disputes",
          path: "/admin/disputes",
          icon: <FaGavel />,
        },
      ],
    },

  ];

  return (
    <aside
    
      className={`
        fixed top-0 left-0 z-50 h-screen w-64
        p-5 overflow-y-auto border-r
        transition-all duration-300

        ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }

        ${openSidebar ? "translate-x-0" : "-translate-x-full"}

        md:translate-x-0
      `}
    >
      <button
  onClick={() => setOpenSidebar(false)}
  className="
    md:hidden
    absolute top-5 right-5
    text-xl
    text-gray-500
  "
>
  <FaTimes />
</button>

      {/* Logo */}
      <div className="flex justify-center mb-6 pt-1">

        <img
          src={logo}
          alt="logo"
          className="h-12 w-auto"
        />

      </div>

      {/* Sections */}
      {menuSections.map((section, sectionIndex) => (

        <div key={sectionIndex} className="mb-6">

          {/* Heading */}
          <h2
            className={`
              text-xs uppercase font-semibold
              mb-3 px-2 tracking-wide

              ${
                darkMode
                  ? "text-gray-500"
                  : "text-gray-400"
              }
            `}
          >
            {section.heading}
          </h2>

          {/* Items */}
          <div className="flex flex-col gap-2">

            {section.items.map((item, index) => (

              <NavLink
                to={item.path}
                end={item.title === "Dashboard"}
                key={index}

                onClick={() => setOpenSidebar(false)}

                className={({ isActive }) => `
                  flex items-center gap-4
                  px-4 py-3 rounded-xl
                  transition-all duration-300 text-left

                  ${
                    isActive
                      ? darkMode
                        ? "bg-gray-800 text-sky-400"
                        : "bg-sky-100 text-sky-600"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >

                {/* Icon */}
                <div className="text-lg">
                  {item.icon}
                </div>

                {/* Title */}
                <span className="font-medium text-sm">
                  {item.title}
                </span>

              </NavLink>

            ))}

          </div>

        </div>

      ))}

    </aside>
  );
}

export default AdminSidebar;