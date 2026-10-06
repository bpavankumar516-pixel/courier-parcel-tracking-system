import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

// Import background image asset
import bgImage from '../../assets/bg.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill user credentials for Pavan
  const handleQuickDemo = () => {
    setValue('email', 'pavan@delivey.com');
    setValue('password', 'password123');
    toast.info('Filled user credentials for Pavan!');
  };

  const handleSocialSignIn = (provider) => {
    toast.info(`Simulating ${provider} Sign-In...`);
    setTimeout(async () => {
      try {
        await login('pavan@delivey.com', 'password123');
        toast.success(`Signed in with ${provider} (Pavan)!`);
        navigate(from, { replace: true });
      } catch (e) {
        toast.error(`${provider} Sign-In failed`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter'] overflow-x-hidden bg-[#DCE6BF]">
      
      {/* Background Image Layer using bg.png */}
      <div 
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/10 lg:bg-transparent"></div>
      </div>

      {/* Main Responsive Grid Container */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[90vh]">
        
        {/* Left Side Hero Area */}
        <div className="hidden lg:block lg:col-span-7 h-full"></div>

        {/* Right Side: Auth Form Card */}
        <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end pr-0 lg:pr-2">
          
          {/* Card Container */}
          <div className="w-full max-w-[500px] bg-white rounded-[36px] py-9 px-8 sm:px-10 shadow-[0_25px_60px_rgba(0,0,0,0.13)] border border-[#D5E4BC] relative overflow-hidden transition-all">
            
            {/* Top Logo Header for Mobile */}
            <div className="lg:hidden flex justify-center mb-4">
              <Logo size="medium" />
            </div>

            {/* Top Deliverly Box Icon & Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-13 h-13 text-[#587640] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 44 44" fill="none" className="w-full h-full text-[#587640]">
                  <path d="M22 6L36 13V29L22 36L8 29V13L22 6Z" fill="#EAF3D8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M22 6V20M22 20L36 13M22 20L8 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 17H8M3 23H7M5 29H9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-[28px] font-extrabold text-[#233D19] tracking-tight leading-none">
                  Welcome Back!
                </h2>
                <p className="text-xs text-[#698453] mt-1 font-medium">
                  Sign in to your Deliverly account and track shipments.
                </p>
              </div>
            </div>

            {/* Demo Login Pill */}
            <div className="mb-4 py-2 px-4 bg-[#F4F9EC] rounded-xl border border-[#E1EDCD] flex items-center justify-between text-xs">
              <span className="font-bold text-[#233D19]">Demo Login:</span>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="px-4 py-1 bg-[#587640] text-white font-bold text-xs rounded-lg hover:bg-[#233D19] transition shadow-2xs"
              >
                User
              </button>
            </div>

            {/* Seamless Tab Switcher Bar */}
            <div className="bg-[#F2F6ED] p-1 rounded-full grid grid-cols-3 gap-1 border border-[#DCE5D4] mb-5 text-xs font-semibold text-center select-none shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`w-full py-2.5 px-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19] hover:bg-[#E4ECC0]/50'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  navigate('/register');
                }}
                className={`w-full py-2.5 px-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19] hover:bg-[#E4ECC0]/50'
                }`}
              >
                Register
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  navigate('/forgot-password');
                }}
                className={`w-full py-2.5 px-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === 'forgot'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19] hover:bg-[#E4ECC0]/50'
                }`}
              >
                Forgot Password
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#233D19] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9560]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email format'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 bg-white border ${
                      errors.email ? 'border-red-500' : 'border-[#D7E5BE] focus:border-[#587640]'
                    } rounded-xl text-xs text-[#233D19] placeholder-[#96AB82] focus:outline-none focus:ring-2 focus:ring-[#D7E5BE] transition`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#233D19] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9560]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className={`w-full pl-10 pr-10 py-3 bg-white border ${
                      errors.password ? 'border-red-500' : 'border-[#D7E5BE] focus:border-[#587640]'
                    } rounded-xl text-xs text-[#233D19] placeholder-[#96AB82] focus:outline-none focus:ring-2 focus:ring-[#D7E5BE] transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A9560] hover:text-[#233D19]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#456130] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C2D6A4] text-[#587640] focus:ring-[#587640]"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-bold text-[#587640] hover:underline text-xs"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#587640] hover:bg-[#233D19] active:bg-[#182C11] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Separator Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-[#E3EDD5]"></div>
              <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#8EA57B]">
                or continue with
              </span>
            </div>

            {/* 3 Social Buttons Row (Google | Facebook | Apple) */}
            <div className="flex items-center justify-center gap-3 my-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn('Google')}
                title="Sign in with Google"
                className="w-11 h-11 bg-[#FAFCF7] border border-[#D7E5BE] hover:bg-[#EEF5E3] rounded-full flex items-center justify-center shadow-2xs transition-transform hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn('Facebook')}
                title="Sign in with Facebook"
                className="w-11 h-11 bg-[#FAFCF7] border border-[#D7E5BE] hover:bg-[#EEF5E3] rounded-full flex items-center justify-center shadow-2xs transition-transform hover:scale-105"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn('Apple')}
                title="Sign in with Apple"
                className="w-11 h-11 bg-[#FAFCF7] border border-[#D7E5BE] hover:bg-[#EEF5E3] rounded-full flex items-center justify-center shadow-2xs transition-transform hover:scale-105"
              >
                <svg className="w-5 h-5 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.81 1.12-1.95.99-3.09-.97.04-2.14.65-2.83 1.46-.62.72-1.16 1.88-1.01 3.01 1.08.08 2.18-.57 2.85-1.38z" />
                </svg>
              </button>
            </div>

            {/* Card Footer Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-[#698453]">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#587640] hover:underline">
                  Register here
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
