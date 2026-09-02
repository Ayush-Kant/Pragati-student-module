import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentImage from "./images/student.png";
import manager from "./images/managers.png";
import mentor from "./images/mentor.png";
import { registerApi } from './services/auth.services';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rolesInfo = {
    student: {
      title: 'Candidate / Student',
      description: 'Explore leagues, apply for jobs, and competitions for your future.',
      image: studentImage,
      bgColor: 'bg-[#2563EB]',
      textColor: 'text-[#2563EB]',
      borderColor: 'border-[#2563EB]',
      focusRing: 'focus:ring-[#2563EB]/20',
      focusBorder: 'focus:border-[#2563EB]',
      lightBg: 'bg-[#2563EB]/10',
      footerText: "Why Choose Uptoskills? • Build Skills, Compete, Get Hired and Earn Rewards."
    },
    mentor: {
      title: 'Campus / Faculty',
      description: 'Organise Competitions, Manage Placements, and structure academic benchmarks.',
      image: manager,
      bgColor: 'bg-[#00a896]',
      textColor: 'text-[#00a896]',
      borderColor: 'border-[#00a896]',
      focusRing: 'focus:ring-[#00a896]/20',
      focusBorder: 'focus:border-[#00a896]',
      lightBg: 'bg-[#00a896]/10',
      footerText: "Why Campus Partner with Uptoskills? • HR Connect, Branding, AI Candidates Tracking."
    },
    college: {
      title: 'Mentor / Corporate',
      description: 'Speed up your hiring with AI Tools, interactive ATS, and global tracking.',
      image: mentor,
      bgColor: 'bg-[#EA580C]',
      textColor: 'text-[#EA580C]',
      borderColor: 'border-[#EA580C]',
      focusRing: 'focus:ring-[#EA580C]/20',
      focusBorder: 'focus:border-[#EA580C]',
      lightBg: 'bg-[#EA580C]/10',
      footerText: "Collaborate with Uptoskills • Easy Talent Access & AI Tools."
    },
    company: {
      title: 'Corporate',
      description: 'Speed up your hiring with AI Tools, interactive ATS, and global tracking.',
      image: mentor,
      bgColor: 'bg-[#EA580C]',
      textColor: 'text-[#EA580C]',
      borderColor: 'border-[#EA580C]',
      focusRing: 'focus:ring-[#EA580C]/20',
      focusBorder: 'focus:border-[#EA580C]',
      lightBg: 'bg-[#EA580C]/10',
      footerText: "Collaborate with Uptoskills • Easy Talent Access & AI Tools."
    }
  };

  const currentTheme = rolesInfo[selectedRole];

  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-slate-200', width: 'w-0' };
    let points = 0;
    if (password.length >= 6) points++;
    if (password.length >= 10) points++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) points++;
    if (/[^A-Za-z0-9]/.test(password)) points++;

    if (points <= 1) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' };
    if (points === 2 || points === 3) return { label: 'Medium', color: 'bg-amber-400', width: 'w-2/3' };
    return { label: 'Strong', color: currentTheme.bgColor, width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.apiError) {
      setErrors((prev) => ({ ...prev, [name]: '', apiError: '' }));
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleSubmit = async (e) => {
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
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const registerres = await registerApi(formData, selectedRole);
      if (registerres.success) {
        toast.success(registerres.message || 'Registration successful! Please log in.');
        navigate('/login');
      } else {
        setErrors({ apiError: registerres.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({
        apiError: error?.response?.data?.message || error?.message || 'Registration failed',
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
          <div className="bg-white rounded-[24px] p-4 my-auto shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white/40 flex flex-col items-center text-center transform scale-100 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full h-48 rounded-[16px] overflow-hidden mb-4 border border-gray-100 shadow-inner relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />
              <img src={currentTheme.image} alt={currentTheme.title} className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform scale-105 group-hover:scale-100" />
            </div>
            <h3 className={`text-xl font-extrabold ${currentTheme.textColor} tracking-tight mb-1`}>{currentTheme.title}</h3>
            <p className="text-xs text-gray-500 font-medium px-2 leading-relaxed max-w-[280px]">{currentTheme.description}</p>
          </div>
          <div className="space-y-4">
            <div className="text-[11px] font-medium bg-black/15 p-3 rounded-xl backdrop-blur-md border border-white/5 leading-relaxed tracking-wide shadow-inner">
              {currentTheme.footerText}
            </div>
            <div className="flex gap-2 items-center pl-1">
              {Object.keys(rolesInfo).map((role) => (
                <span key={role} className={`h-1.5 rounded-full transition-all duration-500 ${selectedRole === role ? 'w-7 bg-white shadow-sm' : 'w-1.5 bg-white/35'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className={`w-full md:w-[52%] p-3 md:p-6 flex flex-col justify-center border-2 ${currentTheme.borderColor} rounded-[24px] transition-all duration-700 ease-in-out`}>
          <div className="w-full max-w-sm mx-auto space-y-5 my-auto">
            <div className="text-center space-y-1">
              <h2 className={`text-[38px] font-black ${currentTheme.textColor} tracking-tight leading-none drop-shadow-sm transition-colors duration-500`}>Register</h2>
              <p className="text-sm text-gray-400 font-medium">Please enter your details to sign up</p>
            </div>

            <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border transition-colors duration-500 ${currentTheme.lightBg} border-gray-100`}>
              {Object.keys(rolesInfo).map((role) => (
                <button key={role} type="button" onClick={() => handleRoleChange(role)} className={`py-2 text-xs font-bold rounded-lg transition-all capitalize ${selectedRole === role ? `bg-white shadow-sm ${rolesInfo[role].textColor}` : 'text-gray-500 hover:text-gray-800'}`}>
                  {role}
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {errors.apiError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errors.apiError}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Email Address</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm ${errors.email ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}`} />
                {errors.email && <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm pr-12 ${errors.password ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-400 hover:${currentTheme.textColor} transition-colors focus:outline-none`}>
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
                {errors.password && <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Confirm Password</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all text-sm shadow-sm pr-12 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${currentTheme.focusRing} ${currentTheme.focusBorder}`}`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-400 hover:${currentTheme.textColor} transition-colors focus:outline-none`}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{errors.confirmPassword}</p>}
              </div>

              <button disabled={submitting} type="submit" className={`w-full mt-2 flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white ${currentTheme.bgColor} opacity-90 hover:opacity-100 active:scale-[0.99] transition-all duration-500 outline-none disabled:cursor-not-allowed disabled:opacity-50`}>
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400 font-medium">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className={`font-bold ${currentTheme.textColor} hover:underline transition-all duration-500`}>
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

export default RegisterPage;
