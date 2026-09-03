import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentImage from './images/student.png';
import manager from './images/managers.png';
import mentor from './images/mentor.png';
import { registerApi } from './services/auth.services';
import {
  googleStudentApi,
  loginStudentApi,
  registerStudentApi,
} from './services/studentAuth.services';
import {
  getFirebaseIdToken,
  signInStudentWithGoogle,
  signInStudentWithPassword,
} from '../../firebase/studentFirebaseAuth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const initialFormData = {
  fullName: '',
  collegeId: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rolesInfo = {
    student: {
      title: 'Candidate / Student',
      description: 'Build skills, complete learning, compete, and prepare for placements.',
      image: studentImage,
      bgColor: 'bg-[#2563EB]',
      textColor: 'text-[#2563EB]',
      borderColor: 'border-[#2563EB]',
      focusRing: 'focus:ring-[#2563EB]/20',
      focusBorder: 'focus:border-[#2563EB]',
      lightBg: 'bg-[#2563EB]/10',
      footerText: 'Student account • Firebase-secured sign-in • Guided profile onboarding.',
    },
    mentor: {
      title: 'Campus / Faculty',
      description: 'Organise competitions, manage placements, and structure academic benchmarks.',
      image: manager,
      bgColor: 'bg-[#00a896]',
      textColor: 'text-[#00a896]',
      borderColor: 'border-[#00a896]',
      focusRing: 'focus:ring-[#00a896]/20',
      focusBorder: 'focus:border-[#00a896]',
      lightBg: 'bg-[#00a896]/10',
      footerText: 'Why campus partners with Uptoskills? • HR Connect, Branding, AI Candidate Tracking.',
    },
    college: {
      title: 'Mentor / Corporate',
      description: 'Connect with learners and support skill development, hiring, and mentorship.',
      image: mentor,
      bgColor: 'bg-[#EA580C]',
      textColor: 'text-[#EA580C]',
      borderColor: 'border-[#EA580C]',
      focusRing: 'focus:ring-[#EA580C]/20',
      focusBorder: 'focus:border-[#EA580C]',
      lightBg: 'bg-[#EA580C]/10',
      footerText: 'Collaborate with Uptoskills • Easy Talent Access & AI Tools.',
    },
    company: {
      title: 'Corporate',
      description: 'Speed up hiring with AI tools, interactive ATS, and global candidate tracking.',
      image: mentor,
      bgColor: 'bg-[#EA580C]',
      textColor: 'text-[#EA580C]',
      borderColor: 'border-[#EA580C]',
      focusRing: 'focus:ring-[#EA580C]/20',
      focusBorder: 'focus:border-[#EA580C]',
      lightBg: 'bg-[#EA580C]/10',
      footerText: 'Collaborate with Uptoskills • Easy Talent Access & AI Tools.',
    },
  };

  const currentTheme = rolesInfo[selectedRole];

  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-slate-200', width: 'w-0' };

    let points = 0;
    if (password.length >= 8) points += 1;
    if (password.length >= 12) points += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) points += 1;
    if (/[^A-Za-z0-9]/.test(password)) points += 1;

    if (points <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' };
    if (points === 2 || points === 3) return { label: 'Medium', color: 'bg-amber-400', width: 'w-2/3' };
    return { label: 'Strong', color: currentTheme.bgColor, width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);
  const isStudent = selectedRole === 'student';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.apiError) {
      setErrors((prev) => ({ ...prev, [name]: '', apiError: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData(initialFormData);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateStudentForm = () => {
    const nextErrors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const collegeId = formData.collegeId.trim();

    if (fullName.length < 2 || fullName.length > 80) {
      nextErrors.fullName = 'Enter your full name (2–80 characters).';
    }

    if (!/^\d+$/.test(collegeId)) {
      nextErrors.collegeId = 'Enter the numeric College ID provided by your college.';
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (
      formData.password.length < 8 ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[^A-Za-z0-9]/.test(formData.password)
    ) {
      nextErrors.password = 'Use at least 8 characters with an uppercase letter, digit, and special character.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const validateLegacyForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    return nextErrors;
  };

  const submitStudentRegistration = async () => {
    const email = formData.email.trim().toLowerCase();
    const registered = await registerStudentApi({
      email,
      password: formData.password,
      fullName: formData.fullName.trim(),
      collegeId: Number(formData.collegeId),
    });

    if (!registered?.success) {
      throw new Error(registered?.message || 'Student registration failed');
    }

    await signInStudentWithPassword(email, formData.password);
    const idToken = await getFirebaseIdToken();
    const session = await loginStudentApi(idToken);

    login('student', session.accessToken);
    toast.success('Account created. Complete your student profile.');
    navigate('/student/onboarding', { replace: true });
  };

  const submitLegacyRegistration = async () => {
    const registerResponse = await registerApi(
      {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      selectedRole,
    );

    if (!registerResponse?.success) {
      throw new Error(registerResponse?.message || 'Registration failed');
    }

    toast.success(registerResponse.message || 'Registration successful! Please log in.');
    navigate('/login');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const nextErrors = isStudent ? validateStudentForm() : validateLegacyForm();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isStudent) await submitStudentRegistration();
      else await submitLegacyRegistration();
    } catch (error) {
      setErrors({
        apiError: error?.response?.data?.message || error?.message || 'Registration failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleStudentRegistration = async () => {
    setErrors({});
    if (!/^\d+$/.test(formData.collegeId.trim())) {
      setErrors({ collegeId: 'Enter your numeric College ID before using Google sign-in.' });
      return;
    }

    setSubmitting(true);
    try {
      await signInStudentWithGoogle();
      const idToken = await getFirebaseIdToken();

      let session;
      try {
        session = await loginStudentApi(idToken);
      } catch (error) {
        if (error?.response?.status !== 404) throw error;
        session = await googleStudentApi(idToken, Number(formData.collegeId));
      }

      login('student', session.accessToken);
      toast.success('Google account connected. Complete your student profile.');
      navigate('/student/onboarding', { replace: true });
    } catch (error) {
      setErrors({
        apiError: error?.response?.data?.message || error?.message || 'Google registration failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFBF7] p-4 md:p-8 font-sans antialiased">
      <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row relative p-4 gap-4 border border-gray-100">
        <div className={`w-full md:w-[48%] ${currentTheme.bgColor} rounded-[24px] p-6 md:p-8 flex flex-col justify-between text-white transition-all duration-700 ease-in-out relative min-h-[490px] md:min-h-[540px]`}>
          <div className="text-2xl font-black tracking-tight bg-white/15 inline-block px-4 py-1.5 rounded-xl backdrop-blur-md border border-white/10 self-start shadow-sm">
            Uptoskills
          </div>

          <div className="bg-white rounded-[24px] p-4 my-auto shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white/40 flex flex-col items-center text-center transform hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full h-48 rounded-[16px] overflow-hidden mb-4 border border-gray-100 shadow-inner relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />
              <img
                src={currentTheme.image}
                alt={currentTheme.title}
                className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform scale-105 group-hover:scale-100"
              />
            </div>
            <h3 className={`text-xl font-extrabold ${currentTheme.textColor} tracking-tight mb-1`}>
              {currentTheme.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium px-2 leading-relaxed max-w-[280px]">
              {currentTheme.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-medium bg-black/15 p-3 rounded-xl backdrop-blur-md border border-white/5 leading-relaxed tracking-wide shadow-inner">
              {currentTheme.footerText}
            </div>
            <div className="flex gap-2 items-center pl-1">
              {Object.keys(rolesInfo).map((role) => (
                <span
                  key={role}
                  className={`h-1.5 rounded-full transition-all duration-500 ${selectedRole === role ? 'w-7 bg-white shadow-sm' : 'w-1.5 bg-white/35'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={`w-full md:w-[52%] p-3 md:p-6 flex flex-col justify-center border-2 ${currentTheme.borderColor} rounded-[24px] transition-all duration-700 ease-in-out`}>
          <div className="w-full max-w-sm mx-auto space-y-5 my-auto">
            <div className="text-center space-y-1">
              <h2 className={`text-[38px] font-black ${currentTheme.textColor} tracking-tight leading-none drop-shadow-sm`}>
                Create Account
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                {isStudent ? 'Create your student account and continue to guided onboarding.' : 'Please enter your details to sign up.'}
              </p>
            </div>

            <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border transition-colors duration-500 ${currentTheme.lightBg} border-gray-100`}>
              {Object.keys(rolesInfo).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${selectedRole === role ? `bg-white shadow-sm ${rolesInfo[role].textColor}` : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
              {errors.apiError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errors.apiError}
                </div>
              )}

              {isStudent && (
                <>
                  <Field
                    id="fullName"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    error={errors.fullName}
                    autoComplete="name"
                  />
                  <Field
                    id="collegeId"
                    label="College ID"
                    name="collegeId"
                    value={formData.collegeId}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    inputMode="numeric"
                    error={errors.collegeId}
                  />
                </>
              )}

              <Field
                id="email"
                label={isStudent ? 'College Email' : 'Email Address'}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={isStudent ? 'student@college.edu' : 'you@example.com'}
                error={errors.email}
                autoComplete="email"
              />

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={isStudent ? 'At least 8 characters' : '••••••••'}
                    className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm pr-12 ${errors.password ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1.5 space-y-1 px-1">
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                      <span>Password strength:</span>
                      <span className="font-bold text-gray-600">{strength.label}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 font-medium pl-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm pr-12 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium pl-1">{errors.confirmPassword}</p>}
              </div>

              <button
                disabled={submitting}
                type="submit"
                className={`w-full mt-2 flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white ${currentTheme.bgColor} opacity-90 hover:opacity-100 active:scale-[0.99] transition-all duration-500 outline-none disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {submitting ? 'Creating Account...' : isStudent ? 'Create Student Account' : 'Create Account'}
              </button>

              {isStudent && (
                <>
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">or</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleGoogleStudentRegistration}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue with Google
                  </button>
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    Google sign-up uses the College ID above to create or link your student account.
                  </p>
                </>
              )}
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate(isStudent ? '/student/login' : '/login')}
                  className={`font-bold ${currentTheme.textColor} hover:underline transition-all duration-500`}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Field({ id, label, name, value, onChange, placeholder, type = 'text', inputMode, error, autoComplete }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
      />
      {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
    </div>
  );
}

export default RegisterPage;
