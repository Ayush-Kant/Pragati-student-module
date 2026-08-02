import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import OnboardingLayout from "../components/layout/OnboardingLayout";

const Availability = () => {

  const navigate = useNavigate();

  const days = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  const times = [
    "09:00 AM",
    "02:00 PM",
    "07:00 PM",
  ];

  const [selectedSlots, setSelectedSlots] =
    useState([
      "MON-09:00 AM",
      "WED-09:00 AM",
      "THU-09:00 AM",
      "MON-02:00 PM",
      "TUE-02:00 PM",
    ]);

  const toggleSlot = (day, time) => {

    const key = `${day}-${time}`;

    if (selectedSlots.includes(key)) {

      setSelectedSlots(
        selectedSlots.filter(
          (slot) => slot !== key
        )
      );

    } else {

      setSelectedSlots([
        ...selectedSlots,
        key,
      ]);

    }
  };

  return (

    <OnboardingLayout
      step={4}
      title=""
      subtitle=""
    >
<div className="max-w-7xl mx-auto">
{/* Todo: Removed thing  */}
 
  {/*<div className="flex justify-end mb-4">

    <span className="text-gray-600 font-semibold text-lg">
      Almost Finished! 🎉
    </span>

  </div> */}
  

  {/* MAIN WHITE CARD */}
  <div className="bg-white rounded-[35px] shadow-sm p-12 border-l-6 border-green-500">
          {/* HEADER */}
          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-5xl font-bold text-gray-900">
                Weekly Availability
              </h1>

              <p className="text-gray-500 text-xl mt-5 leading-9">
                Select the slots when you are available for 1:1 mentorship sessions.
                <br />
                These can be adjusted later.
              </p>

            </div>

            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl">
               <FaCalendarAlt className="text-4xl text-blue-600" />
            </div>

          </div>

          {/* TABLE */}
          <div className="mt-14 overflow-x-auto">

            <div className="grid grid-cols-8 gap-4 min-w-[1000px]">

              {/* EMPTY */}
              <div></div>

              {/* DAYS */}
              {days.map((day) => (

                <div
                  key={day}
                  className="text-center font-bold text-gray-700 text-lg"
                >
                  {day}
                </div>

              ))}

              {/* TIME ROWS */}
              {times.map((time) => (

                <React.Fragment key={time}>

                  {/* TIME LABEL */}
                  <div className="flex flex-col justify-center text-gray-700 font-semibold text-lg">

                    <span>{time}</span>

                    <span className="text-gray-400 text-sm mt-2">
                      (45 mins)
                    </span>

                  </div>

                  {/* SLOTS */}
                  {days.map((day) => {

                    const key = `${day}-${time}`;

                    const isSelected =
                      selectedSlots.includes(key);

                    return (

                      <button
                        key={key}
                        onClick={() =>
                          toggleSlot(day, time)
                        }
                        className={`h-32 rounded-2xl border text-xl font-semibold transition-all duration-300

                        ${
                          isSelected
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "bg-white border-gray-200 text-gray-500 hover:border-purple-300"
                        }
                        `}
                      >

                        {isSelected ? (

                          <div className="flex flex-col items-center justify-center">

                            <span>{time}</span>

                            <span className="text-base mt-3">
                              Selected
                            </span>

                          </div>

                        ) : (

                          <span className="text-3xl">
                            +
                          </span>

                        )}

                      </button>

                    );
                  })}

                </React.Fragment>

              ))}

            </div>

          </div>

          {/* INFO BOX */}
          <div className="mt-10 bg-purple-50 rounded-2xl p-6 flex items-center gap-5">

             <div>
    <FaInfoCircle className="text-4xl text-purple-700" />
  </div>

            <p className="text-gray-600 text-lg leading-8">

              Standard sessions are 45 minutes long.
              You can configure your timezone
              and buffer times in settings after registration.

            </p>

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-between mt-10">

          {/* PREVIOUS */}
          <button
            onClick={() =>
              navigate(
                "/mentor/onboarding/experience-links"
              )
            }
            className="border-2 border-purple-400 text-purple-700 px-12 py-4 rounded-full text-xl font-semibold hover:bg-purple-50 transition"
          >
            ← Previous
          </button>

          {/* COMPLETE */}
          <button
            onClick={() =>
              alert(
                "Registration Completed Successfully 🎉"
              )
            }
            className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-14 py-4 rounded-full text-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            Complete Registration ✓
          </button>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-10 mb-10">

          <p className="text-gray-500 text-lg">
            Need help?
            <span className="text-purple-600 font-semibold ml-2">
              Contact Support
            </span>
          </p>

        </div>

      </div>

    </OnboardingLayout>
  );
};

export default Availability;