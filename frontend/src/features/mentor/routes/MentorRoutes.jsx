import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentorLayout from '../components/layout/MentorLayout';
import Dashboard from '../pages/Dashboard';

export default function MentorRoutes() {
  return (
    <Routes>
      <Route element={<MentorLayout />}>
        {/* Index point par direct bina kisi error ke dashboard match hoga */}
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}