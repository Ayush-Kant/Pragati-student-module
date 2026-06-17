import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MentorLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
