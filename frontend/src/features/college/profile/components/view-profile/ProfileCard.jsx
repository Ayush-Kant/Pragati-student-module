import React from 'react';

export default function ProfileCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {title && (
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
