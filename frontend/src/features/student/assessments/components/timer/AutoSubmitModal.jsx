import React from "react";

export default function AutoSubmitModal({ isOpen }) {
  if (!isOpen) return null;
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600">Time expired. Submitting your test...</p>
    </div>
  );
}