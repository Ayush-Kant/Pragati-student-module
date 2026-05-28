import React from 'react';
import useActivities from '../hooks/useActivities';
import ActivityStatsRow from './ActivityStatsRow';
import ActivityFilters from './ActivityFilters';
import ActivityCard from './ActivityCard';
import ActivitySidebar from './ActivitySidebar';

const ActivityFeed = () => {
  const { activities, stats, loading, error } = useActivities();

  return (
    <div>
      <ActivityStatsRow stats={stats} />
      <div className="mt-8">
        {/* Tabs will go here */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <a href="#" className="px-1 py-4 text-sm font-medium text-indigo-600 border-b-2 border-indigo-500 whitespace-nowrap">Activity Feed</a>
            <a href="#" className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">Created Activities</a>
            <a href="#" className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">Pending Reviews</a>
            <a href="#" className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">Templates</a>
            <a href="#" className="px-1 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">Analytics</a>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFilters />
          {loading && <p>Loading...</p>}
          {error && <p>Error loading activities.</p>}
          {!loading && !error && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Today</h2>
                <div className="mt-2 space-y-4">
                  {activities.filter(a => a.status === 'pending').map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Yesterday</h2>
                 <div className="mt-2 space-y-4">
                  {activities.filter(a => a.status === 'completed').map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
               <div className="text-center">
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                  Load More Activities
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <ActivitySidebar />
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
