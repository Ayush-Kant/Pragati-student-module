// src/features/student/placement/pages/CareerProfilePage.jsx
// Main page for student career profile, resume management, and section completeness.

import React from 'react';
import PlacementNavigation from '../components/common/PlacementNavigation';
import CareerProfile from '../components/profile/CareerProfile';
import { useCareerProfile } from '../hooks/useCareerProfile';

export default function CareerProfilePage() {
  const { profile, isLoading, isError, error, refetch } = useCareerProfile();

  return (
    <div className="min-h-screen bg-surface-50">
      <PlacementNavigation />

      <main className="page-container animate-fade-in">
        <div className="page-header">
          <h2 className="page-title">Career & Placement Profile</h2>
          <p className="page-description">
            Maintain your verified academic credentials, verified skills, and resume for campus recruitment drives.
          </p>
        </div>

        <CareerProfile
          profile={profile}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
        />
      </main>
    </div>
  );
}
