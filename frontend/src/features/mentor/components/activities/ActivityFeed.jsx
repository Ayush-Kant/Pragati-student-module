import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Printer } from 'lucide-react';
import { useActivityContext } from '../../context/ActivityContext';
import ActivityStatsRow from './ActivityStatsRow';
import ActivityFilters from './ActivityFilters';
import ActivityCard from './ActivityCard';
import ActivitySidebar from './ActivitySidebar';
import { formatDateRange } from '../../../../utils/dateUtils';

const ActivityFeed = () => {
  const { activities, stats, loading, error, removeActivity } = useActivityContext();
  const [activeTab, setActiveTab] = useState('feed');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  
  // Set default date range to last 30 days or based on activities
  const defaultDateRange = useMemo(() => {
    if (!activities || activities.length === 0) {
      const today = new Date();
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      return [{ startDate: past, endDate: today, key: 'selection' }];
    }
    const validDates = activities.map(a => new Date(a.createdAt)).filter(d => !isNaN(d.getTime()));
    if (validDates.length === 0) {
      const today = new Date();
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      return [{ startDate: past, endDate: today, key: 'selection' }];
    }
    const minDate = new Date(Math.min(...validDates));
    const maxDate = new Date(Math.max(...validDates));
    return [{ startDate: minDate, endDate: maxDate, key: 'selection' }];
  }, [activities]);

  const [dateRange, setDateRange] = useState(defaultDateRange);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [filters, setFilters] = useState({
    search: '',
    type: 'All Types',
    status: 'All Status',
    mentee: 'All Mentees'
  });

  // Filter logic based on tabs and dates
  const getFilteredActivities = () => {
    let filtered = activities;
    switch (activeTab) {
      case 'created':
        filtered = activities;
        break;
      case 'pending':
        filtered = activities.filter(a => a.status === 'pending' || a.status === 'published');
        break;
      case 'templates':
        filtered = activities.filter(a => a.status === 'draft');
        break;
      case 'analytics':
        return []; // handled separately
      case 'feed':
      default:
        filtered = activities;
        break;
    }
    
    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(a => a.title?.toLowerCase().includes(searchLower) || a.type?.toLowerCase().includes(searchLower));
    }
    
    // Filter by type
    if (filters.type !== 'All Types') {
      const typeMap = {
        'Assignment': 'assignment',
        'Quiz': 'quiz',
        'Coding': 'coding',
        'Case Study': 'case_study'
      };
      if (typeMap[filters.type]) {
        filtered = filtered.filter(a => a.type === typeMap[filters.type]);
      }
    }
    
    // Filter by status
    if (filters.status !== 'All Status') {
      const statusMap = {
        'Pending': 'pending', // or 'published' based on previous logic
        'Completed': 'completed',
        'In Progress': 'in_progress',
        'Draft': 'draft'
      };
      if (statusMap[filters.status]) {
        filtered = filtered.filter(a => a.status === statusMap[filters.status] || (statusMap[filters.status] === 'pending' && a.status === 'published'));
      }
    }

    // Filter by dates
    return filtered.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      if (isNaN(activityDate.getTime())) return true;
      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      // Normalizing time for accurate day comparison
      const normActivityDate = new Date(activityDate.setHours(0, 0, 0, 0));
      const normStart = new Date(start).setHours(0, 0, 0, 0);
      const normEnd = new Date(end).setHours(23, 59, 59, 999);
      return normActivityDate >= normStart && normActivityDate <= normEnd;
    });
  };

  const displayedActivities = getFilteredActivities();

  return (
    <div className="printable-content">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 no-print">
        <nav className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-hide" aria-label="Tabs">
          <button onClick={() => setActiveTab('feed')} className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap ${activeTab === 'feed' ? 'text-white bg-indigo-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>Activity Feed</button>
          <button onClick={() => setActiveTab('created')} className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap ${activeTab === 'created' ? 'text-white bg-indigo-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>Created Activities</button>
          <button onClick={() => setActiveTab('pending')} className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap flex items-center ${activeTab === 'pending' ? 'text-white bg-indigo-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
            Pending Reviews <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === 'pending' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-100 text-indigo-600'}`}>{activities.filter(a => a.status === 'pending' || a.status === 'published').length}</span>
          </button>
          <button onClick={() => setActiveTab('templates')} className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap ${activeTab === 'templates' ? 'text-white bg-indigo-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>Templates</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 text-sm font-medium rounded-full whitespace-nowrap ${activeTab === 'analytics' ? 'text-white bg-indigo-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>Analytics</button>
        </nav>
        <div className="relative" ref={datePickerRef}>
            <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex items-center text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 w-full md:w-auto justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> 
                  <span>{`${formatDateRange(dateRange[0].startDate.toISOString(), dateRange[0].endDate.toISOString())}`}</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showDatePicker && (
                <div className="absolute top-full right-0 z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className="p-2 border border-gray-300 rounded-md text-sm w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={dateRange[0].startDate.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setDateRange([{ ...dateRange[0], startDate: newDate }]);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      className="p-2 border border-gray-300 rounded-md text-sm w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={dateRange[0].endDate.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setDateRange([{ ...dateRange[0], endDate: newDate }]);
                        }
                      }}
                    />
                  </div>
                </div>
            )}
        </div>
      </div>

      <ActivityStatsRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          {activeTab !== 'analytics' && (
            <div className="no-print mb-6">
              <ActivityFilters filters={filters} setFilters={setFilters} />
            </div>
          )}
          {loading && <p className="text-center py-10">Loading...</p>}
          {error && <p className="text-center py-10 text-red-500">Error loading activities.</p>}
          {!loading && !error && activeTab !== 'analytics' && (
            <div className="space-y-6">
              {displayedActivities.length === 0 ? (
                <div className="text-center py-10 bg-white border rounded-lg">
                  <p className="text-gray-500">No activities found in this section.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedActivities.map((activity, index) => (
                    <ActivityCard key={`act-${activity.id || index}`} activity={activity} removeActivity={() => removeActivity(activity.id)} />
                  ))}
                </div>
              )}
               <div className="text-center mt-8 no-print">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto">
                  Load More Activities <span className="ml-1">↓</span>
                </button>
              </div>
            </div>
          )}
          {!loading && !error && activeTab === 'analytics' && (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
              <p className="text-gray-600 mb-4">Track completion rates and overall engagement.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-md">
                  <h4 className="text-indigo-800 font-medium">Completion Rate</h4>
                  <p className="text-2xl font-bold mt-2">78%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-md">
                  <h4 className="text-green-800 font-medium">Average Score</h4>
                  <p className="text-2xl font-bold mt-2">85/100</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-1 no-print">
          <ActivitySidebar />
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
