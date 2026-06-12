import React, { useState } from "react";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ProfileEditForm from "../components/profile/ProfileEditForm";

import useMentorProfile from "../hooks/useMentorProfile";

const MentorProfile = () => {

  /* DARK MODE */
  const [darkMode, setDarkMode] =
    useState(false);

  const {
    profile,
    loading,
    error,
    isEditing,
    setIsEditing,
    saveProfile,
  } = useMentorProfile();

  /* LOADING */
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gray-100"
        }`}
      >

        <div className="flex flex-col items-center">

          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

          <p
            className={`mt-5 text-xl font-semibold ${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            Loading Profile...
          </p>

        </div>

      </div>
    );
  }

  /* NO PROFILE DATA */
  if (!loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">No profile data found.</p>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gray-100"
        }`}
      >

        <div
          className={`shadow-xl rounded-3xl p-10 text-center ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-black"
          }`}
        >

          <h2 className="text-3xl font-bold text-red-500">
            Error
          </h2>

          <p className="mt-4 text-gray-500">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div

      className={`min-h-screen   px-6 pb-6 pt-2   transition-all duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >

      <ToastContainer />

{/* TOP HEADER */}
<div className="flex items-start justify-between mb-4">

  {/* LEFT LOGO */}
  <div className="flex items-center gap-4">

    <img
      src="https://uptoskills.com/UptoSkills.webp"
      alt="UptoSkills"
      className="w-40 h-22 object-contain rounded-xl shadow-md"
    />

    

  </div>

  {/* THEME TOGGLE */}
  <button
    onClick={() =>
      setDarkMode(!darkMode)
    }
    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
      darkMode
        ? "bg-yellow-400 text-black"
        : "bg-gray-800 text-white"
    }`}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

</div>


  

      {/* PAGE TITLE */}
      <div className="text-center mb-6 -mt-4">

        <h1 className="text-5xl font-bold">
          Mentor Profile
        </h1>

        <p
          className={`mt-3 ${
            darkMode
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          Manage your mentor information
        </p>

      </div>

      {/* VIEW MODE */}
      {!isEditing ? (

        <div
          className={`rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto transition-all duration-500 ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-white text-black"
          }`}
        >

          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row items-start gap-12">

            {/* AVATAR */}
            <img
              src={profile.avatarUrl}
              alt="mentor"
              className="w-44 h-44 rounded-full border-[6px] border-purple-500 object-cover shadow-lg"
            />

            {/* DETAILS */}
            <div className="flex-1">

              {/* NAME */}
              <div className="flex items-center gap-3">

                <h1 className="text-4xl font-bold">
                  {profile.fullName}
                </h1>

                {profile.verified && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Verified
                  </span>
                )}

              </div>

              {/* BIO */}
              <p
                className={`mt-5 leading-7 ${
                  darkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {profile.bio}
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-3 mt-5">

                {profile.expertiseTags.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}

              </div>

              {/* DRIVES */}
              <div className="mt-6">

                <h2 className="font-bold text-xl mb-2">
                  Assigned Drives
                </h2>

                {profile.assignedDrives.map(
                  (drive) => (
                    <p key={drive.driveId}>
                      • {drive.title}
                    </p>
                  )
                )}

              </div>

              {/* EDIT BUTTON */}
              <button
                onClick={() =>
                  setIsEditing(true)
                }
                className="mt-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Edit Profile
              </button>

            </div>
          </div>

          {/* AVAILABILITY */}
        {/* AVAILABILITY */}
<div className="mt-10">

  <h2 className="text-2xl font-bold mb-6">
    Availability Schedule
  </h2>

  <div
    className={`rounded-3xl p-6 border shadow-lg transition-all duration-300 ${
      darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }`}
  >

    <div className="grid md:grid-cols-2 gap-6">

      {/* DAY SELECT */}
      <div>

        <label
          className={`block mb-3 font-semibold ${
            darkMode
              ? "text-gray-200"
              : "text-gray-700"
          }`}
        >
          Available Day
        </label>

        <select
          className={`w-full px-4 py-3 rounded-2xl border outline-none transition-all duration-300 shadow-sm ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-50 border-gray-300 text-black"
          }`}
        >
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>

      </div>

      {/* TIME SELECT */}
      <div>

        <label
          className={`block mb-3 font-semibold ${
            darkMode
              ? "text-gray-200"
              : "text-gray-700"
          }`}
        >
          Available Time
        </label>

        <select
          className={`w-full px-4 py-3 rounded-2xl border outline-none transition-all duration-300 shadow-sm ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-50 border-gray-300 text-black"
          }`}
        >
          <option>
            09:00 AM - 05:00 PM
          </option>

          <option>
            10:00 AM - 06:00 PM
          </option>

        </select>

      </div>

    </div>

  </div>

</div>

        </div>

      ) : (

        /* EDIT MODE */
        <ProfileEditForm
          profile={profile}
          onCancel={() =>
            setIsEditing(false)
          }
          onSave={saveProfile}
        />

      )}

    </div>
  );
};

export default MentorProfile;