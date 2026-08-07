import React from "react";

export default function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
      <p className="text-sm font-medium">Are you sure you want to submit?</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="px-3 py-1 bg-green-600 text-white text-xs rounded">Confirm</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-xs rounded">Cancel</button>
      </div>
    </div>
  );
}