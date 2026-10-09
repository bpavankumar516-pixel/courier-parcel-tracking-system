import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Check,
  Truck,
  Package,
  AlertTriangle,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  getActivitiesFromStorage,
  markActivityAsRead,
  markAllActivitiesAsRead
} from '../../services/activityLogger';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState(getActivitiesFromStorage());

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
  };

  // Sync unread notification count & activity list in real time
  const updateActivities = () => {
    const logs = getActivitiesFromStorage();
    setActivities(logs);
  };

  useEffect(() => {
    updateActivities();
    window.addEventListener('deliverly_activity_log', updateActivities);
    return () => window.removeEventListener('deliverly_activity_log', updateActivities);
  }, []);

  // Compute unread count
  const unreadCount = useMemo(() => {
    return activities.filter((a) => a.unread !== false).length;
  }, [activities]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item) => {
    markActivityAsRead(item.id);
    setNotifOpen(false);
    if (item.trackingNo) {
      navigate(`/tracking?trackingNo=${item.trackingNo}`);
      toast.info(`Opening live tracking for ${item.trackingNo}`);
    } else {
      navigate('/notifications');
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllActivitiesAsRead();
    toast.success('All notifications marked as read!');
  };

  return (
    <header className="w-full bg-white py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 border-b border-[#E1EAD8]/60 font-['Inter']">
      
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
      <div className="flex items-center gap-4 sm:gap-5">
        
        {/* Notification Bell Icon Popover Trigger */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="relative p-2.5 bg-white rounded-full border border-[#D5E2C9] hover:bg-[#EAF1E2] text-[#425E2F] transition shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E53935] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Premium Notification Popover Dropdown Card */}
          {notifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#DCE6D2] py-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 font-['Inter']">
              
              {/* Popover Header */}
              <div className="p-4 px-5 bg-[#233D19] text-white flex items-center justify-between border-b border-[#385429]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#A3E635]" />
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-white leading-none">
                      Notifications
                    </h3>
                    <p className="text-[10px] text-[#A3C986] mt-0.5 font-medium">
                      {unreadCount} unread activity alerts
                    </p>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] bg-[#385429] hover:bg-[#4A6437] text-white font-bold px-2.5 py-1 rounded-full transition flex items-center gap-1 cursor-pointer border border-[#587640]"
                  >
                    <Check className="w-3 h-3 text-[#A3E635]" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Stream List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#EEF4E8] bg-[#F9FCF7]">
                {activities.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="w-6 h-6 text-[#93A782] mx-auto" />
                    <p className="text-xs font-bold text-[#233D19]">No notifications yet</p>
                    <p className="text-[11px] text-[#698453]">Activities will appear here in real time.</p>
                  </div>
                ) : (
                  activities.slice(0, 7).map((item) => {
                    const isUnread = item.unread !== false;

                    let IconComp = FileText;
                    let iconBg = 'bg-[#E8F5E9]';
                    let iconColor = 'text-[#2E7D32]';

                    if (item.type === 'shipment_create') {
                      IconComp = Package;
                      iconBg = 'bg-[#E3F2FD]';
                      iconColor = 'text-[#1976D2]';
                    } else if (item.type === 'shipment_deliver') {
                      IconComp = Truck;
                      iconBg = 'bg-[#E8F5E9]';
                      iconColor = 'text-[#2E7D32]';
                    } else if (item.type === 'shipment_update') {
                      IconComp = Truck;
                      iconBg = 'bg-[#E0F2F1]';
                      iconColor = 'text-[#00897B]';
                    } else if (item.type.startsWith('customer')) {
                      IconComp = User;
                      iconBg = 'bg-[#F3E5F5]';
                      iconColor = 'text-[#7B1FA2]';
                    }

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 px-4 flex items-start gap-3 transition cursor-pointer hover:bg-[#F0F6E8] ${
                          isUnread ? 'bg-[#F4F8EF]' : 'bg-white opacity-85'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-2xs ${iconBg} ${iconColor}`}>
                          <IconComp className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#233D19] truncate">
                              {item.title}
                            </h4>
                            <span className="text-[9px] font-semibold text-[#7A9560] ml-2 flex-shrink-0">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C7847] leading-tight line-clamp-1">
                            {item.subtitle}
                          </p>
                        </div>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 self-center flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Popover Footer */}
              <div className="p-3 px-4 bg-white border-t border-[#EEF4E8] flex items-center justify-between">
                <span className="text-[10px] text-[#698453] font-medium">Real-time Activity Logs</span>
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-bold text-[#233D19] hover:text-[#385429] flex items-center gap-1 hover:underline"
                >
                  <span>View All Notifications</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#587640]" />
                </Link>
              </div>

            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3 py-1 px-2 pr-3 bg-white rounded-full border border-[#D5E2C9] hover:bg-[#EAF1E2] transition shadow-2xs cursor-pointer"
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

          {/* Profile Dropdown Card */}
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
                  className="w-full text-left px-4 py-2 text-xs text-[#233D19] hover:bg-[#F4F7EF] flex items-center gap-2 font-medium cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#587640]" />
                  <span>My Account</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
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
