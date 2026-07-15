// ProfilePage.jsx (merged)
import { useState } from "react";
import ProfileEditForm from "../../components/profile/ProfileEditForm";


  const errors = {};
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

  if (links.github && !urlRegex.test(links.github)) {
    errors.github = "Please enter a valid GitHub URL (e.g., https://github.com/username)";
  }
  if (links.linkedin && !urlRegex.test(links.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn profile link";
  }
  if (links.website && !urlRegex.test(links.website)) {
    errors.website = "Please enter a valid website portfolio domain URL";
  }
const ValidationAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl mt-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

