import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ActivityProvider } from './context/ActivityContext';
import { Search, Bell, MessageSquare, ChevronDown, Home, Users, Calendar, ClipboardList, BookOpen, PlayCircle, Activity, BarChart2, Folder, Settings, HelpCircle, Menu, X } from 'lucide-react';

const MentorNavbar = ({ onToggleMobile }) => (

  <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-gray-200">
    <div className="flex items-center flex-1">
      {/* Mobile menu button */}
      <button onClick={onToggleMobile} className="md:hidden p-2 mr-2 text-gray-600 hover:text-gray-800">
        <Menu className="w-6 h-6" />
      </button>
      {/* Search Bar */}
      <div className="relative w-full max-w-xl ml-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="w-5 h-5" />
        </span>
        <input type="text" className="w-full py-2 pl-10 pr-4 bg-gray-50 border-transparent rounded-full focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search for opportunities, profiles, leagues..." />
      </div>
    </div>
    
    <div className="flex items-center gap-6 ml-4">
      {/* Icons */}
      <div className="flex items-center gap-4 text-gray-500">
        <button className="relative p-1 hover:text-gray-700">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="relative p-1 hover:text-gray-700">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
        <img className="w-10 h-10 rounded-full object-cover border border-gray-200" src="https://ui-avatars.com/api/?name=Arjun+Sharma&background=0D8ABC&color=fff" alt="User" />
        <div className="hidden sm:block text-sm">
          <p className="text-gray-500 text-xs">Mentor</p>
          <p className="font-semibold text-gray-800 flex items-center">Arjun Sharma <ChevronDown className="w-4 h-4 ml-1" /></p>
        </div>
      </div>

      {/* Enterprise Button */}
      <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600">
        For Enterprise
      </button>
    </div>
  </header>
);

const MENTOR_NAV_ITEMS = [
  { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/mentor/dashboard' },
  { name: 'My Mentees', icon: <Users className="w-5 h-5" />, path: '/mentor/mentees' },
  { name: 'Sessions', icon: <Calendar className="w-5 h-5" />, path: '/mentor/sessions' },
  { name: 'Assessments', icon: <ClipboardList className="w-5 h-5" />, path: '/mentor/assessments' },
  { name: 'Tasks & Assignments', icon: <ClipboardList className="w-5 h-5" />, path: '/mentor/tasks' },
  { name: 'Courses', icon: <BookOpen className="w-5 h-5" />, path: '/mentor/courses' },
  { name: 'Lessons', icon: <PlayCircle className="w-5 h-5" />, path: '/mentor/lessons' },
  { name: 'Activity', icon: <Activity className="w-5 h-5" />, path: '/mentor/activities' },
  { name: 'Reports & Analytics', icon: <BarChart2 className="w-5 h-5" />, path: '/mentor/reports' },
  { name: 'Resources', icon: <Folder className="w-5 h-5" />, path: '/mentor/resources' },
  { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/mentor/calendar' },
  { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, path: '/mentor/messages' },
  { name: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/mentor/notifications' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/mentor/settings' },
];

const MentorSidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-6">
         {/* UptoSkills Logo Placeholder */}
         <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">UPTO<span className="text-orange-500">SKILLS</span></span>
         </div>
         <p className="text-xs text-gray-500 mt-1">Transform Your Career Path</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {MENTOR_NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Need Help */}
      <div className="p-4 m-4 bg-indigo-50 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4 opacity-20">
          <HelpCircle className="text-indigo-600 w-full h-full" />
        </div>
        <h4 className="font-semibold text-indigo-900">Need Help?</h4>
        <p className="mt-1 text-xs text-indigo-700">Our Support Team is here to help you!</p>
        <button className="mt-3 px-4 py-2 text-xs font-semibold text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-gray-50">
          Get Support &gt;
        </button>
      </div>
    </div>
  );
};

const MentorLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((s) => !s);

  return (
    <ActivityProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <MentorSidebar />
        </div>

        {/* Mobile overlay sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black opacity-40" onClick={toggleMobile} />
            <div className="relative z-10 w-64 h-full bg-white border-r border-gray-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="text-lg font-semibold">UPTOSKILLS</div>
                <button onClick={toggleMobile} className="p-2 text-gray-600 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="h-[calc(100%-56px)] overflow-y-auto">
                <MentorSidebar />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <MentorNavbar onToggleMobile={toggleMobile} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container px-4 sm:px-6 lg:px-8 py-6 mx-auto xl:px-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ActivityProvider>
  );
};

export default MentorLayout;
