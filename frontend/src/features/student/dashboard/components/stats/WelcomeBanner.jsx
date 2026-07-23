import React from "react";
import PropTypes from "prop-types";

export default function WelcomeBanner({ studentName = "Student" }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
        Welcome back, {studentName}! 👋
      </h1>
      <p className="text-sm text-gray-500 mt-1">Your placement journey at a glance</p>
    </div>
  );
}

WelcomeBanner.propTypes = {
  studentName: PropTypes.string,
};