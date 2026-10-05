import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

// Import background image asset
import bgImage from '../../assets/bg.png';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forgot');
  const [step, setStep] = useState(1); // 1: Email Verification, 2: New Password Form, 3: Success State
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerEmailForm,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors }
  } = useForm();

  const {
    register: registerResetForm,
    handleSubmit: handleResetSubmit,
    watch: watchReset,
    formState: { errors: resetErrors }
  } = useForm();

  const newPasswordValue = watchReset('newPassword', '');

  // Step 1 Submit
  const onEmailSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      setResetEmail(data.email);
      setStep(2);
      toast.info('Email verified! Set your new password below.');
    } catch {
      toast.error('An error occurred. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submit
  const onResetSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(resetEmail, data.newPassword);
      setStep(3);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {/* Card Container - Matching exact width (500px), height (py-9 px-8 sm:px-10), and rounded-[36px] */}
          <div className="w-full max-w-[500px] bg-white rounded-[36px] py-9 px-8 sm:px-10 shadow-[0_25px_60px_rgba(0,0,0,0.13)] border border-[#D5E4BC] relative overflow-hidden transition-all">
            
            {/* Top Logo Header for Mobile */}
            <div className="lg:hidden flex justify-center mb-4">
              <Logo size="medium" />
            </div>

            {/* Deliverly Box Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-13 h-13 text-[#587640] flex items-center justify-center">
                <svg viewBox="0 0 44 44" fill="none" className="w-full h-full text-[#587640]">
                  <path d="M22 6L36 13V29L22 36L8 29V13L22 6Z" fill="#EAF3D8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M22 6V20M22 20L36 13M22 20L8 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 17H8M3 23H7M5 29H9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-4">
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-[28px] font-extrabold text-[#233D19] tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-[#698453] mt-1 font-medium leading-relaxed">
                Reset your credentials to regain access to Deliverly.
              </p>
            </div>

            {/* Tab Switcher (Matching Exact Screenshot Design) */}
            <div className="bg-[#F2F6ED] p-1 rounded-full flex items-center justify-between gap-0 border border-[#DCE5D4] mb-5 text-xs font-semibold text-center select-none shadow-2xs">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={`flex-1 py-2.5 px-3 rounded-full transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19]'
                }`}
              >
                Login
              </button>
              
              <div className="w-[1px] h-4 bg-[#D2DDC8]"></div>

              <button
                type="button"
                onClick={() => navigate('/register')}
                className={`flex-1 py-2.5 px-3 rounded-full transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19]'
                }`}
              >
                Register
              </button>

              <div className="w-[1px] h-4 bg-[#D2DDC8]"></div>

              <button
                type="button"
                onClick={() => setActiveTab('forgot')}
                className={`flex-1 py-2.5 px-3 rounded-full transition-all duration-200 ${
                  activeTab === 'forgot'
                    ? 'bg-[#587640] text-white font-bold shadow-xs'
                    : 'text-[#506941] hover:text-[#233D19]'
                }`}
              >
                Forgot Password
              </button>
            </div>

            {/* Step 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-bold text-[#233D19] mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9560]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="pavan@delivey.com"
                      {...registerEmailForm('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email format'
                        }
                      })}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FAFCF7] border ${
                        emailErrors.email ? 'border-red-500' : 'border-[#D7E5BE] focus:border-[#587640]'
                      } rounded-xl text-xs text-[#233D19] placeholder-[#96AB82] focus:outline-none focus:ring-2 focus:ring-[#D7E5BE] transition`}
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{emailErrors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#587640] hover:bg-[#233D19] active:bg-[#182C11] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>Continue to Reset</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: New Password Form */}
            {step === 2 && (
              <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4" noValidate>
                <div className="text-center mb-1">
                  <span className="text-[11px] font-bold text-[#587640] bg-[#F4F9EC] px-3 py-1 rounded-full border border-[#E1EDCD]">
                    Account: {resetEmail}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#233D19] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9560]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...registerResetForm('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Must be at least 6 characters' }
                      })}
                      className={`w-full pl-10 pr-10 py-3 bg-[#FAFCF7] border ${
                        resetErrors.newPassword ? 'border-red-500' : 'border-[#D7E5BE] focus:border-[#587640]'
                      } rounded-xl text-xs text-[#233D19] placeholder-[#96AB82] focus:outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A9560]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {resetErrors.newPassword && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{resetErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#233D19] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9560]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      {...registerResetForm('confirmNewPassword', {
                        required: 'Please confirm password',
                        validate: (val) => val === newPasswordValue || 'Passwords do not match'
                      })}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FAFCF7] border ${
                        resetErrors.confirmNewPassword ? 'border-red-500' : 'border-[#D7E5BE] focus:border-[#587640]'
                      } rounded-xl text-xs text-[#233D19] placeholder-[#96AB82] focus:outline-none transition`}
                    />
                  </div>
                  {resetErrors.confirmNewPassword && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{resetErrors.confirmNewPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#587640] hover:bg-[#233D19] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#F4F9EC] text-[#587640] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D7E5BE]">
                  <CheckCircle2 className="w-8 h-8 text-[#587640]" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] mb-1">
                  Password Reset Complete!
                </h3>
                <p className="text-xs text-[#698453] mb-5">
                  Your password has been updated. You can now sign in.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3 px-6 bg-[#587640] hover:bg-[#233D19] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Go to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Card Footer Link */}
            <div className="mt-5 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#587640] hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
