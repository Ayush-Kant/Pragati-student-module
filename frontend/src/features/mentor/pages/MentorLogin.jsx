import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const MentorLogin = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errors, setErrors] =
    useState({});

  // EMAIL VALIDATION
  const validateEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  };

  // LOGIN FUNCTION
  const handleLogin = () => {

    let newErrors = {};

    // EMAIL CHECK
    if (!email) {

      newErrors.email =
        "Email is required";

    } else if (
      !validateEmail(email)
    ) {

      newErrors.email =
        "Enter a valid email";

    }

    // PASSWORD CHECK
    if (!password) {

      newErrors.password =
        "Password is required";

    } else if (
      password.length < 6
    ) {

      newErrors.password =
        "Password must be at least 6 characters";

    }

    setErrors(newErrors);

    // IF ERRORS EXIST
    if (
      Object.keys(newErrors).length > 0
    ) {

      //alert(
        //"Please fix the errors before login"
     // );

      return;
    }

    // SUCCESS LOGIN
    //alert("Login Successful!");

    navigate(
      "/mentor/onboarding/basic-info"
    );
  };

  return (

    <div className="min-h-screen bg-[#f7f7fb] flex items-center justify-center px-4 py-10">

      {/* CARD */}
      <div className="w-full max-w-[620px] bg-white rounded-[32px] shadow-xl p-10 relative overflow-hidden">

        {/* TOP LINE */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500"></div>

        {/* LOGO */}
        <div className="flex justify-center">

          <img
            src="https://uptoskills.com/UptoSkills.webp"
            alt="logo"
            className="w-72"
          />

        </div>

        {/* TITLE */}
        <h1 className="text-center text-[56px] font-bold mt-8 leading-tight">

          <span className="text-purple-600">
            Mentor
          </span>

          <span className="text-blue-500 ml-3">
            Portal
          </span>

          <span className="text-teal-500 ml-3">
            Access
          </span>

        </h1>

        {/* EMAIL */}
        <div className="mt-12">

          <label className="flex items-center gap-3 text-[26px] font-semibold text-gray-800">

            ✉️ Registered Email

          </label>

          <input
            type="email"
            placeholder="mentor@uptoskills.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className={`mt-4 w-full border rounded-2xl px-6 py-5 text-2xl outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-purple-500"
            }`}
          />

          {errors.email && (

            <p className="text-red-500 mt-2 text-lg">

              {errors.email}

            </p>

          )}

        </div>

        {/* PASSWORD */}
        <div className="mt-10">

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-3 text-[26px] font-semibold text-gray-800">

              🔒 Secret Password

            </label>

            <button className="text-purple-600 font-semibold text-lg">

              Forgot Password?

            </button>

          </div>

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className={`mt-4 w-full border rounded-2xl px-6 py-5 text-2xl outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />

            {/* SHOW PASSWORD */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-6 top-9 text-3xl"
            >
              👁️
            </button>

          </div>

          {errors.password && (

            <p className="text-red-500 mt-2 text-lg">

              {errors.password}

            </p>

          )}

        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full mt-12 bg-gradient-to-r from-purple-700 via-blue-600 to-teal-500 text-white py-5 rounded-2xl text-3xl font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          Login to Dashboard →
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mt-12">

          <div className="flex-1 h-[1px] bg-gray-300"></div>

          <p className="text-gray-400 font-semibold">

            NEW TO UPTOSKILLS?

          </p>

          <div className="flex-1 h-[1px] bg-gray-300"></div>

        </div>

        {/* REGISTER BUTTON */}
        <button
          onClick={() =>
            navigate(
              "/mentor/onboarding/basic-info"
            )
          }
          className="mt-10 w-full border-2 border-teal-500 text-teal-600 py-5 rounded-2xl text-3xl font-semibold hover:bg-teal-50 transition"
        >
          Launch New Drive →
        </button>

      </div>

    </div>

  );
};

export default MentorLogin;