import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckSquare, ClipboardList, Presentation, Briefcase, File, Timer, Users, Calendar } from 'lucide-react';

const ActivitySidebar = () => {
  const navigate = useNavigate();

  const handleCreateActivity = (type) => {
    navigate('/mentor/activities/create', { state: { type } });
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'templates':
        navigate('/mentor/activities/templates');
        break;
      case 'deadlines':
        navigate('/mentor/activities/deadlines');
        break;
      case 'bulk_assign':
        navigate('/mentor/activities/bulk-assign');
        break;
      case 'calendar':
        navigate('/mentor/activities/calendar');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 non-printable">
        <h3 className="font-semibold text-gray-800">Create Activity</h3>
        <p className="text-sm text-gray-500 mb-4">Select activity type to get started</p>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleCreateActivity('assignment')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-purple-500 mb-2"><FileText className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Assignment</span>
          </button>
          <button onClick={() => handleCreateActivity('quiz')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-green-500 mb-2"><CheckSquare className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Quiz<br/>Assessment</span>
          </button>
          <button onClick={() => handleCreateActivity('practice_task')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-orange-500 mb-2"><ClipboardList className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Practice<br/>Task</span>
          </button>
          <button onClick={() => handleCreateActivity('session')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-red-400 mb-2"><Presentation className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Session<br/>Activity</span>
          </button>
          <button onClick={() => handleCreateActivity('career')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-blue-500 mb-2"><Briefcase className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Career<br/>Activity</span>
          </button>
          <button onClick={() => handleCreateActivity('resource')} className="flex flex-col items-center justify-center p-3 text-center border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <span className="text-pink-500 mb-2"><File className="w-6 h-6" /></span>
            <span className="text-xs font-medium text-gray-700">Resource</span>
          </button>
        </div>
      </div>
      
      <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Activity Overview</h3>
        <div className="flex items-center justify-between">
          <div className="relative w-28 h-28">
             {/* A simple implementation of a donut chart using conic-gradient */}
             <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#10B981 0% 35%, #3B82F6 35% 57%, #F59E0B 57% 79%, #EC4899 79% 88%, #9CA3AF 88% 100%)' }}></div>
             <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
               <span className="text-xl font-bold text-gray-800">128</span>
               <span className="text-xs text-gray-500">Total</span>
             </div>
          </div>
          <div className="flex-1 ml-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Completed (45)</div>
              <span className="font-semibold">35%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> In Progress (28)</div>
              <span className="font-semibold">22%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Pending (28)</div>
              <span className="font-semibold">22%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600"><span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span> Drafts (12)</div>
              <span className="font-semibold">9%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600"><span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span> Cancelled (15)</div>
              <span className="font-semibold">12%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 non-printable">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
            <button onClick={() => handleQuickAction('templates')} className="flex flex-col items-center justify-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                <span className="text-purple-600 mb-2"><FileText className="w-5 h-5" /></span>
                <span className="text-[10px] font-medium text-gray-700 leading-tight">Activity<br/>Templates</span>
            </button>
            <button onClick={() => handleQuickAction('deadlines')} className="flex flex-col items-center justify-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                <span className="text-green-600 mb-2"><Timer className="w-5 h-5" /></span>
                <span className="text-[10px] font-medium text-gray-700 leading-tight">Manage<br/>Deadlines</span>
            </button>
            <button onClick={() => handleQuickAction('bulk_assign')} className="flex flex-col items-center justify-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                <span className="text-orange-500 mb-2"><Users className="w-5 h-5" /></span>
                <span className="text-[10px] font-medium text-gray-700 leading-tight">Bulk Assign<br/>Activity</span>
            </button>
            <button onClick={() => handleQuickAction('calendar')} className="flex flex-col items-center justify-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
                <span className="text-blue-500 mb-2"><Calendar className="w-5 h-5" /></span>
                <span className="text-[10px] font-medium text-gray-700 leading-tight">Activity<br/>Calendar</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySidebar;
