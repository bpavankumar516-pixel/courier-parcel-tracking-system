import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#F4F7EF] py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 border-b border-[#E1EAD8]/60 font-['Inter']">
      
      {/* Search Bar Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#748C61]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shipments, customers, tracking number..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5E2C9] rounded-full text-xs text-[#233D19] placeholder-[#8EA57B] focus:outline-none focus:ring-2 focus:ring-[#8EA57B]/30 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Right User Actions & Notifications */}
      <div className="flex items-center gap-5">
        
        {/* Notification Bell Icon */}
        <button
          type="button"
          onClick={() => toast.info('You have 3 unread shipment notifications!')}
          className="relative p-2 bg-white rounded-full border border-[#D5E2C9] hover:bg-[#EAF1E2] text-[#425E2F] transition shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E53935] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white">
            3
          </span>
        </button>

        {/* User Profile Pill & Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 py-1 px-2 pr-3 bg-white rounded-full border border-[#D5E2C9] hover:bg-[#EAF1E2] transition shadow-2xs"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#587640] text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-[#D5E2C9]">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0) || 'P'}</span>
              )}
            </div>

            {/* Name & Role */}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#233D19] leading-tight">
                {user?.name || 'Pavan Kumar'}
              </p>
              <p className="text-[10px] font-medium text-[#6B8556]">
                {user?.role || 'Admin'}
              </p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#587640]" />
          </button>

          {/* Dropdown Card */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D5E2C9] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#EAF1E2]">
                <p className="text-xs font-bold text-[#233D19]">{user?.name || 'Pavan Kumar'}</p>
                <p className="text-[11px] text-[#6B8556] truncate">{user?.email || 'pavan@delivey.com'}</p>
                <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-[#F0F6E8] text-[#587640] font-bold text-[10px] rounded-md">
                  <ShieldCheck className="w-3 h-3" /> {user?.role || 'Admin'} Session
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    toast.info('Profile Settings modal coming soon!');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#233D19] hover:bg-[#F4F7EF] flex items-center gap-2 font-medium"
                >
                  <User className="w-3.5 h-3.5 text-[#587640]" />
                  <span>My Account</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Header;
