// src/features/college/dashboard/pages/DashboardPage.jsx

import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

import ActivityFeed from '../components/activity/ActivityFeed';
import RecentUpdates from '../components/activity/RecentUpdates';
import QuickActions from '../components/quick-actions/QuickActions';

export default function DashboardPage() {
  const {
    dashboardStats,
    activities,
    placementData,
    revenueData,
    admissionsData,
    isLoading,
    error,
    refetch
  } = useDashboardData();

  return (
    <div
      style={{
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '900px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '16px',
          justifyContent: 'space-between'
        }}
      >
        <h2 style={{ margin: 0 }}>Service Layer Test Panel</h2>


        <button
          onClick={refetch}
          disabled={isLoading}
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isLoading ? 'Loading...' : '🔄 Trigger Refetch Logic'}
        </button>
      </div>

      {isLoading && (
        <p style={{ color: '#0288d1', fontWeight: 'bold' }}>
          ⏳ Fetching data from service layer (Loading State Active)...
        </p>
      )}

      {error && (
        <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
          ❌ Error caught: {error}
        </p>
      )}

      {!isLoading && !error && (
        <div
          style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}
        >
          <p
            style={{
              color: '#2e7d32',
              margin: '0 0 12px 0',
              fontWeight: 'bold'
            }}
          >
            ✅ Hook Connected Successfully! Verified Data Arrays:
          </p>

          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              lineHeight: '2'
            }}
          >
            <li>
              <code>dashboardStats</code>: {dashboardStats?.length || 0} items loaded
            </li>

            <li>
              <code>activities</code>: {activities?.length || 0} items loaded
            </li>

            <li>
              <code>placementData</code>: {placementData?.length || 0} items loaded
            </li>

            <li>
              <code>revenueData</code>: {revenueData?.length || 0} items loaded
            </li>

            <li>
              <code>admissionsData</code>: {admissionsData?.length || 0} items loaded
            </li>
          </ul>

          <p
            style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '12px',
              fontStyle: 'italic'
            }}
          >
            *Note: Press F12 and open your browser Console tab to see the full objects array printed out.
          </p>
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <ActivityFeed />
      </div>

      <div style={{ marginTop: '24px' }}>
        <RecentUpdates />
      </div>

      <div style={{ marginTop: '24px' }}>
        <QuickActions />
      </div>
    </div>
  );
}