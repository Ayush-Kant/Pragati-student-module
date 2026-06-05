import React, { useState, useEffect } from "react";

export default function CourseStatCards({ courses, loading, error }) {
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.status === "Published")
      .length,
    draftCourses: courses.filter((course) => course.status === "Draft").length,
    totalEnrollments: courses.reduce(
      (sum, course) => sum + (course.students || 0),
      0,
    ),
  };

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="col-span-4 text-center py-8">
          <p className="animate-pulse">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="col-span-4 text-center py-8 text-red-500">
          <p>Error loading statistics: {error}</p>
        </div>
      </div>
    );
  }

  const STATS_CONFIG = [
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      trend: "+4 this month",
      color: "bg-blue-500",
      icon: "📘",
    },
    {
      title: "Published Courses",
      value: stats.publishedCourses.toString(),
      trend: "+3 this month",
      color: "bg-emerald-500",
      icon: "▶",
    },
    {
      title: "Draft Courses",
      value: stats.draftCourses.toString(),
      trend: "+1 this month",
      color: "bg-orange-400",
      icon: "✎",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      trend: "+12% this month",
      color: "bg-purple-500",
      icon: "👥",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {STATS_CONFIG.map((item, index) => (
        <div
          key={index}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="mt-2 text-4xl font-bold text-gray-900">
                {item.value}
              </h2>
              <p className="mt-3 text-sm font-medium text-emerald-600">
                {item.trend} ↗
              </p>
            </div>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
