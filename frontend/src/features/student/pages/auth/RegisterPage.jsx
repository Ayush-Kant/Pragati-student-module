import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  // State management for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State management for individual errors
  const [errors, setErrors] = useState({});

  // Visibility toggle flags
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Multi-tier structural evaluation for dynamic password strength
  const getPasswordStrength = (password) => {
    if (!password)
      return {
        label: '',
        color: 'bg-gray-200',
        width: 'w-0',
      };

    let points = 0;

    if (password.length >= 6) points++;
    if (password.length >= 10) points++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) points++;
    if (/[^A-Za-z0-9]/.test(password)) points++;

    if (points <= 1) {
      return {
        label: 'Weak',
        color: 'bg-red-500',
        width: 'w-1/3',
      };
    }

    if (points === 2 || points === 3) {
      return {
        label: 'Medium',
        color: 'bg-yellow-500',
        width: 'w-2/3',
      };
    }

    return {
      label: 'Strong',
      color: 'bg-green-500',
      width: 'w-full',
    };
  };

  const strength = getPasswordStrength(formData.password);

  // Unified input field sync wrapper
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Submission interceptor and local integrity validator
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Registration data structurally ready:', formData);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-50 px-4 py-12 sm:px-6 lg:px-8">

      {/* Centered Auth Card wrapper container */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-orange-100">

        {/* Core Title Block Component */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">
            Create an account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Start managing your onboarding module
          </p>
        </div>

        {/* Interactive Registration Document Tree */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-4">

            {/* Target Email Vector */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`block w-full px-4 py-2.5 bg-orange-50/30 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition duration-200 sm:text-sm ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-orange-200'
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Primary Secure Credential Parameter */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full px-4 py-2.5 bg-orange-50/30 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition duration-200 sm:text-sm pr-12 ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-orange-200'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-medium text-gray-400 hover:text-orange-600 transition-colors focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Dynamic Structural Strength Evaluator Bar */}
              {formData.password && (
                <div className="mt-2 space-y-1.5">

                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} ${strength.width} transition-all duration-300 ease-out`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Password strength:
                    </span>

                    <span
                      className={`font-semibold ${
                        strength.label === 'Weak'
                          ? 'text-red-500'
                          : strength.label === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Verification Credential Shadow Sync Parameter */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full px-4 py-2.5 bg-orange-50/30 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition duration-200 sm:text-sm pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-orange-200'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-medium text-gray-400 hover:text-orange-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Action Dispatch Triggers */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Backward Link Navigation Vector */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-orange-600 hover:text-orange-500 focus:outline-none underline-offset-4 hover:underline transition-all"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;