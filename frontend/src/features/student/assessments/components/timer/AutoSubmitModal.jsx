import React from "react";

export default function AutoSubmitModal({ isOpen = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-fade-in">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          ⏱️
        </div>
        <h3 className="text-xl font-bold text-gray-900">Time Has Expired!</h3>
        <p className="text-sm text-gray-600">
          Your assessment duration is complete. We are automatically calculating and submitting your answers now.
        </p>
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}