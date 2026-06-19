import { useProfileData } from '../college/profile/hooks/useProfileData';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentImage from "./images/student.png";
import manager from "./images/managers.png";
import mentor from "./images/mentor.png";
import { loginApi } from './services/auth.services';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const slidesData = [
    {
      id: 'candidate',
      title: "Candidate / Student",
      desc: "Explore leagues, apply for jobs, and competitions for your future.",
      bgColor: "bg-[#2563EB]",
      textColor: "text-[#2563EB]",
      borderColor: "border-[#2563EB]",
      focusRing: "focus:ring-[#2563EB]/20",
      focusBorder: "focus:border-[#2563EB]",
      image: studentImage,
      footerText: "Why Choose Uptoskills? • Build Skills, Compete, Get Hired and Earn Rewards."
    },
    {
      id: 'campus',
      title: "Campus / Faculty",
      desc: "Organise Competitions, Manage Placements and more.",
      bgColor: "bg-[#00a896]",
      textColor: "text-[#00a896]",
      borderColor: "border-[#00a896]",
      focusRing: "focus:ring-[#00a896]/20",
      focusBorder: "focus:border-[#00a896]",
      image: manager,
      footerText: "Why Campus Partner with Uptoskills? • HR Connect, Branding, AI Candidates Tracking."
    },
    {
      id: 'corporate',
      title: "Mentor / Corporate",
      desc: "Speed up your hiring with AI Tools and Mentor others.",
      bgColor: "bg-[#EA580C]",
      textColor: "text-[#EA580C]",
      borderColor: "border-[#EA580C]",
      focusRing: "focus:ring-[#EA580C]/20",
      focusBorder: "focus:border-[#EA580C]",
      image: mentor,
      footerText: "Collaborate with Uptoskills • Easy Talent Access & AI Tools."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slidesData.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [slidesData.length]);

  const current = slidesData[currentSlide];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitMessage.text) setSubmitMessage({ type: '', text: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage({ type: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage({ type: '', text: '' });

    try {
      const result = await loginApi({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (result.success) {
        setSubmitMessage({ type: 'success', text: 'Signed in successfully.' });
        login(result.role, result.token);
        navigate(`/${result.role}/dashboard`);
      } else {
        setSubmitMessage({ type: 'error', text: result.message || 'Login failed' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFBF7] p-4 md:p-8 font-sans antialiased">
      <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row relative p-4 gap-4 border border-gray-100">

        {/* LEFT */}
        <div className={`w-full md:w-[48%] ${current.bgColor} rounded-[24px] p-6 md:p-8 flex flex-col justify-between text-white transition-all duration-700 ease-in-out relative min-h-[490px] md:min-h-[540px]`}>
          <div className="text-2xl font-black tracking-tight bg-white/15 inline-block px-4 py-1.5 rounded-xl backdrop-blur-md border border-white/10 self-start shadow-sm">
            Uptoskills
          </div>

          <div className="bg-white rounded-[24px] p-4 my-auto shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white/40 flex flex-col items-center text-center transform scale-100 hover:scale-[1.01] transition-transform duration-300">
            <div className="w-full h-48 rounded-[16px] overflow-hidden mb-4 border border-gray-100 shadow-inner relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform scale-105 group-hover:scale-100"
              />
            </div>
            <h3 className={`text-xl font-extrabold ${current.textColor} tracking-tight mb-1`}>{current.title}</h3>
            <p className="text-xs text-gray-500 font-medium px-2 leading-relaxed max-w-[280px]">{current.desc}</p>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-medium bg-black/15 p-3 rounded-xl backdrop-blur-md border border-white/5 leading-relaxed tracking-wide shadow-inner">
              {current.footerText}
            </div>
            <div className="flex gap-2 items-center pl-1">
              {slidesData.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-7 bg-white shadow-sm' : 'w-1.5 bg-white/35'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={`w-full md:w-[52%] p-3 md:p-6 flex flex-col justify-center border-2 ${current.borderColor} rounded-[24px] transition-all duration-700 ease-in-out`}>
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className={`text-[38px] font-black ${current.textColor} tracking-tight leading-none drop-shadow-sm transition-colors duration-500`}>
                Welcome back
              </h2>
              <p className="text-sm text-gray-400 font-medium">Please enter your details to sign in</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all duration-200 text-sm shadow-sm ${errors.email ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${current.focusRing} ${current.focusBorder}`}`}
                />
                {errors.email && <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`block w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 transition-all duration-200 text-sm shadow-sm pr-12 ${errors.password ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : `border-gray-200 ${current.focusRing} ${current.focusBorder}`}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">{errors.password}</p>}
              </div>

              {submitMessage.text && (
                <p className={`text-sm font-medium ${submitMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {submitMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white ${current.bgColor} opacity-90 hover:opacity-100 active:scale-[0.99] transition-all duration-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400 font-medium">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className={`font-bold ${current.textColor} hover:underline transition-all duration-500`}
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;