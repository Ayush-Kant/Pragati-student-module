import React, { useState } from "react";

const ResumeUpload = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file selected");
  const [dragging, setDragging] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFile = (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, DOCX files are allowed");
      return;
    }

    setFileName(file.name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleUpload = () => {
    if (fileName === "No file selected") {
      alert("Please select a file first");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Resume Uploaded Successfully");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            📤
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>

            <p className="text-sm text-gray-500 mt-1">Add your latest resume</p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl py-7 px-5 text-center transition
            ${
              dragging
                ? "border-blue-500 bg-blue-100"
                : "border-blue-300 bg-blue-50/40"
            }`}
        >
          {/* Icon */}
          <div className="text-5xl mb-3">📄</div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Drag & Drop Resume Here
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mb-5">PDF, DOC, DOCX Supported</p>

          {/* File Input */}
          <div className="flex flex-col items-center gap-3">
            <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Choose Resume
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* File Name */}
            <p className="text-sm text-gray-600 break-all">{fileName}</p>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
