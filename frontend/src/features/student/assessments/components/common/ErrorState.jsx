import React from "react";

export default function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}