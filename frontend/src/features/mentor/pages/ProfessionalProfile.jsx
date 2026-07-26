import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiArrowUpTray } from "react-icons/hi2";


import OnboardingLayout from "../components/layout/OnboardingLayout";

const ProfessionalProfile = () => {

  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] =
    useState([]);

  return (

    <OnboardingLayout
      step={2}
      title=""
      subtitle=""
    >

      {/* STEP TEXT */}
      <div className="text-center">

        <p className="text-purple-600 font-bold tracking-[4px] text-base">
          STEP 02
        </p>

        <h1 className="text-[42px] font-bold text-gray-900 mt-4">
          Complete your professional profile
        </h1>

        <p className="text-gray-500 text-lg mt-4 leading-9 max-w-3xl mx-auto">
          Your profile is the first thing mentees see.
          Let's make it stand out with your
          achievements and expertise.
        </p>

      </div>

      {/* MAIN CARD */}
      <div className="mt-10 bg-white border border-gray-200 rounded-[32px] shadow-sm p-8">

        {/* BIO SECTION */}
       {/*  <div className="border-l-[5px] border-purple-600 pl-8">  */}
          <div className="mt-4 border border-gray-200 border-l-[5px] border-purple-600 rounded-[28px] p-8">


          <h2 className="text-[28px] font-semibold text-gray-900">
            Professional Bio
          </h2>

          <textarea
            rows="7"
            placeholder="Share your professional journey, key achievements, and what motivates you to mentor others..."
            className="mt-6 w-full border border-gray-300 rounded-[24px] px-6 py-5 text-lg outline-none resize-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          <p className="text-right text-gray-400 mt-3 text-sm">
            0 / 500 characters
          </p>

        </div>

        {/* LINKS */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* LINKEDIN */}



{/* LINKEDIN */}
<div className="border border-gray-200 border-l-[5px] border-green-500 rounded-[28px] p-7">

  <div className="flex items-center gap-3">

    <FaLinkedin className="text-2xl text-[#0A66C2]" />

    <h2 className="text-2xl font-semibold text-gray-900">
      LinkedIn URL
    </h2>

  </div>

  <input
    type="text"
    placeholder="https://linkedin.com/in/username"
    className="mt-6 w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-green-400"
  />

</div>

          {/* <div className="border border-gray-200 border-l-[5px] border-green-500 rounded-[28px] p-7">

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                🔗
              </span>

              <h2 className="text-2xl font-semibold text-gray-900">
                LinkedIn URL
              </h2>

            </div>

            <input
              type="text"
              placeholder="https://linkedin.com/in/username"
              className="mt-6 w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-green-400"
            />

          </div> */}

          {/* GITHUB */}
         <div className="border border-gray-200 border-l-[5px] border-orange-400 rounded-[28px] p-7">

            <div className="flex items-center gap-3">

               <FaGithub className="text-2xl text-black" />


              <h2 className="text-2xl font-semibold text-gray-900">
                GitHub / Portfolio
              </h2>

            </div>

            <input
              type="text"
              placeholder="https://github.com/username"
              className="mt-6 w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div> 

        </div>

        {/* CERTIFICATIONS */}
        <div className="mt-10 border border-gray-200 border-l-[5px] border-purple-600 rounded-[28px] p-8">

          {/* TOP */}
          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[28px] font-semibold text-gray-900">
                Industry Certifications
              </h2>

              <p className="text-gray-500 mt-2 text-lg">
                Upload relevant AWS, PMP, or professional credentials.
              </p>

            </div>

            {/* ADD BUTTON */}
            <label className="cursor-pointer bg-purple-100 text-purple-700 px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-200 transition">

              + Add New

              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {

                  const files = Array.from(
                    e.target.files
                  );

                  setUploadedFiles((prev) => [
                    ...prev,
                    ...files,
                  ]);
                }}
              />

            </label>

          </div>

          {/* DRAG AREA */}
          <div
            onDragOver={(e) =>
              e.preventDefault()
            }

            onDrop={(e) => {

              e.preventDefault();

              const files = Array.from(
                e.dataTransfer.files
              );

              setUploadedFiles((prev) => [
                ...prev,
                ...files,
              ]);
            }}

            className="mt-8 bg-purple-50 border border-purple-100 rounded-[28px] p-14 text-center"
          >

            <div className="flex items-center justify-center">
  <HiArrowUpTray className="text-6xl text-gray-800" />
</div>

            <h3 className="mt-5 text-2xl font-semibold text-gray-900">
              Click or drag to upload files
            </h3>
            <p className="text-gray-500 mt-3 text-lg">
              PDF, PNG, JPG (Max 5MB)
            </p>

            {/* BROWSE BUTTON */}
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              id="uploadInput"
              onChange={(e) => {

                const files = Array.from(
                  e.target.files
                );

                setUploadedFiles((prev) => [
                  ...prev,
                  ...files,
                ]);
              }}
            />

            <label
              htmlFor="uploadInput"
              className="inline-block mt-5 text-purple-600 font-semibold cursor-pointer text-lg"
            >
              Browse Files
            </label>

          </div>

          {/* FILE LIST */}
          {uploadedFiles.length > 0 && (

            <div className="mt-6 space-y-4">

              {uploadedFiles.map(
                (file, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-2xl px-5 py-4"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        📎
                      </span>

                      <div>

                        <p className="font-medium text-gray-800 text-lg">
                          {file.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>

                      </div>

                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => {

                        const updated =
                          uploadedFiles.filter(
                            (_, i) =>
                              i !== index
                          );

                        setUploadedFiles(
                          updated
                        );
                      }}
                      className="text-red-500 font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-between mt-12">

          {/* PREVIOUS */}
          <button
            onClick={() =>
              navigate(
                "/mentor/onboarding/basic-info"
              )
            }
            className="border-2 border-gray-300 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition"
          >
            ← Previous Step
          </button>

          {/* CONTINUE */}
          <button
            onClick={() =>
              navigate(
                "/mentor/onboarding/experience-links"
              )
            }
            className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition"
          >
            Continue to Experience →
          </button>

        </div>

      </div>

      {/* SUPPORT */}
      <div className="text-center mt-10 text-gray-500 text-lg">

        Need help?
        <span className="text-purple-600 font-medium ml-2 cursor-pointer">
          Contact Support
        </span>

      </div>

    </OnboardingLayout>

  );
};

export default ProfessionalProfile;