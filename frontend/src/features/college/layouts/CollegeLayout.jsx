import React from 'react';
import { Outlet } from 'react-router-dom';

export const CollegeLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Outlet />
    </div>
  );
};