import React from "react";

const OnboardingLayout = ({
  children,
  step,
  title,
  subtitle,
}) => {

  const steps = [
    "Basic Info",
    "Profile",
    "Experience",
    "Availability",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* LOGO */}
      <div className="mb-8">

        <img
          src="https://uptoskills.com/UptoSkills.webp"
          alt="logo"
          className="w-40"
        />

      </div>

      {/* PAGE HEADER  */}
      <div className="text-center">

        <h1 className="text-5xl font-bold">
          Pragati
        </h1>

        <p className="text-gray-500 mt-2">
          MENTOR ONBOARDING
        </p>

      </div>

     

  {/* RIGHT SIDE TEXT 
  <div className="text-right mt-5">

    <span className="text-gray-600 font-semibold text-lg">
      Almost Finished! 🎉
    </span>

  </div> */}


      {/* STEPPER */}
      <div className="max-w-5xl mx-auto mt-5 flex justify-between items-center">

        {steps.map((item, index) => (

          <div
            key={index}
            className="flex-1 flex flex-col items-center"
          >

            <div
              className={`w-full h-2 rounded-full ${
                step >= index + 1
                  ? "bg-purple-600"
                  : "bg-gray-300"
              }`}
            ></div>

            <p
              className={`mt-3 text-sm font-semibold ${
                step === index + 1
                  ? "text-purple-600"
                  : "text-gray-500"
              }`}
            >
              {item}
            </p>

          </div>

        ))}

      </div>

      {/* CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 mt-10">

        <h2 className="text-4xl font-bold">
          {title}
        </h2>

        <p className="text-gray-500 mt-3 mb-8">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  );
};

export default OnboardingLayout;