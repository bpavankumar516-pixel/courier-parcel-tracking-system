import React from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { LogOut, User, Mail, Shield, CheckCircle2, Package, Clock, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardMock = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-[#D9E2D5] px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <Logo size="medium" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 bg-[#EEF5E7] rounded-full border border-[#D9E2D5]">
            <div className="w-7 h-7 rounded-full bg-[#527D3D] text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-xs text-[#243B32]">
              <span className="font-bold">{user?.name}</span> ({user?.role})
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl transition border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="bg-[#173B27] text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg border border-[#102D20]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#527D3D] rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-[#DDEBC8] font-semibold mb-3">
                <Shield className="w-3.5 h-3.5" /> Module 1 Authentication Active
              </span>
              <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold text-white">
                Welcome, {user?.name}!
              </h1>
              <p className="text-sm text-[#DDEBC8] mt-2 max-w-lg">
                Your authenticated session is stored securely in LocalStorage. Protected routes & static auth are fully functional.
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#DDEBC8]">User Role:</span>
                <span className="font-bold text-white bg-[#527D3D] px-2 py-0.5 rounded">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#DDEBC8]">Session Email:</span>
                <span className="font-semibold text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#DDEBC8]">Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Session
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D9E2D5] shadow-xs">
            <div className="w-10 h-10 bg-[#EEF5E7] text-[#527D3D] rounded-xl flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#173B27] mb-1">Module 1 Completed</h3>
            <p className="text-xs text-[#6C7D75]">
              Login, Register, Forgot Password, Protected Routes, Validation & LocalStorage persistence are verified.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D9E2D5] shadow-xs">
            <div className="w-10 h-10 bg-[#EEF5E7] text-[#527D3D] rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#173B27] mb-1">Protected Route</h3>
            <p className="text-xs text-[#6C7D75]">
              Direct access without authentication redirects automatically to <code className="bg-[#EEF5E7] px-1 rounded text-[#173B27]">/login</code>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D9E2D5] shadow-xs">
            <div className="w-10 h-10 bg-[#EEF5E7] text-[#527D3D] rounded-xl flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#173B27] mb-1">Next Modules Ready</h3>
            <p className="text-xs text-[#6C7D75]">
              Dashboard, Shipment Creation, Customer CRUD, Parcel Tracking, Status Notifications & Analytics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMock;
