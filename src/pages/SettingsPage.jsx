import React, { useState, useEffect, useMemo } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Palette,
  Sliders,
  Link2,
  Database,
  HelpCircle,
  Edit3,
  Package,
  Users,
  Truck,
  Globe,
  Clock,
  Calendar,
  Save,
  X,
  Lock,
  Check,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';
import { useSupport } from '../context/SupportContext';
import { useSettings } from '../context/SettingsContext';
import { logActivity } from '../services/activityLogger';

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { shipments = [] } = useShipments();
  const { customers = [] } = useCustomers();
  const { openSupportChat } = useSupport();
  const {
    currency: sysCurrency,
    weightUnit: sysWeightUnit,
    distanceUnit: sysDistanceUnit,
    dateFormat: sysDateFormat,
    trackingPrefix: sysTrackingPrefix,
    timeZone: sysTimeZone,
    language: sysLanguage,
    enableEmailNotifs: sysEmailNotifs,
    enablePushNotifs: sysPushNotifs,
    updateSettings
  } = useSettings();

  // Active Left Vertical Tab:
  // 'profile' | 'security' | 'notifications' | 'appearance' | 'system' | 'integrations' | 'backup' | 'help'
  const [activeTab, setActiveTab] = useState('profile');

  // --- Dynamic Stats for 3 KPI Cards matching media_1791538770940_2cc12570.png ---
  const stats = useMemo(() => {
    const totalShipments = shipments.length > 0 ? shipments.length : 2486;
    const totalCustomers = customers.length > 0 ? customers.length : 1248;
    const totalDeliveries = shipments.filter((s) => s.status === 'Delivered').length || 1023;

    return {
      totalShipments,
      totalCustomers,
      totalDeliveries
    };
  }, [shipments, customers]);

  // --- Account Information Form State ---
  const [fullName, setFullName] = useState(user?.name || 'Pavan Kumar');
  const [email, setEmail] = useState(user?.email || 'pavan.kumar@deliverly.com');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+91 98765 43210');
  const [role, setRole] = useState(user?.role || 'Admin');
  const [location, setLocation] = useState(() => localStorage.getItem('pref_user_location') || 'Bengaluru, Karnataka, India');
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  // --- Preferences State ---
  const [language, setLanguage] = useState('English');
  const [timeZone, setTimeZone] = useState('(GMT+05:30) Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('DD MMM, YYYY (e.g. 24 Sep, 2026)');
  const [enableEmailNotifs, setEnableEmailNotifs] = useState(true);
  const [enablePushNotifs, setEnablePushNotifs] = useState(true);

  // --- Security Tab State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // --- System Configuration State ---
  const [currency, setCurrency] = useState('INR (₹)');
  const [weightUnit, setWeightUnit] = useState('Kilograms (kg)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers (km)');
  const [trackingPrefix, setTrackingPrefix] = useState('TRK');

  // Keep form state synced with user context changes
  useEffect(() => {
    if (user) {
      setFullName(user.name || 'Pavan Kumar');
      setEmail(user.email || 'pavan.kumar@deliverly.com');
      setPhoneNumber(user.phone || '+91 98765 43210');
      setRole(user.role || 'Admin');
    }
  }, [user]);

  // Save Account Information & Preferences simultaneously
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Full Name and Email Address cannot be empty');
      return;
    }

    localStorage.setItem('pref_user_location', location);

    updateUserProfile({
      name: fullName,
      email: email,
      phone: phoneNumber,
      role: role
    });

    updateSettings({
      language,
      timeZone,
      dateFormat,
      enableEmailNotifs,
      enablePushNotifs
    });

    logActivity('Account information & global preferences saved', `${fullName} (${email})`, 'customer_update');
    toast.success('Account information & global system preferences saved successfully!');
    setIsEditingHeader(false);
  };

  const handleCancelForm = () => {
    setFullName(user?.name || 'Pavan Kumar');
    setEmail(user?.email || 'pavan.kumar@deliverly.com');
    setPhoneNumber(user?.phone || '+91 98765 43210');
    setRole(user?.role || 'Admin');
    setIsEditingHeader(false);
    toast.info('Changes canceled.');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    logActivity('Security password updated', 'Account password changed', 'system');
    toast.success('Security password updated successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all demo shipments and customers to default states?')) {
      localStorage.removeItem('deliverly_shipments_v1');
      localStorage.removeItem('deliverly_customers');
      localStorage.removeItem('deliverly_activities');
      toast.info('Demo data reset! Reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const navTabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Account Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System Configuration', icon: Sliders },
    { id: 'integrations', label: 'API Integrations', icon: Link2 },
    { id: 'backup', label: 'Backup & Data', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-['Inter'] text-[#233D19]">
        
        {/* Uniform Top Header Banner matching reference image media_1791538770940_2cc12570.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
              <Settings className="w-6 h-6 text-[#233D19]" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                Manage your account, preferences and system settings.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Main Grid matching reference image layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Vertical Settings Sidebar Navigation Card (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-1">
            {navTabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF3D8] text-[#233D19] font-bold shadow-2xs border border-[#C6D8B0]'
                      : 'text-[#4F683E] hover:bg-[#F4F8EF] hover:text-[#233D19]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[#233D19]' : 'text-[#587640]'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Settings Content Area (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: Profile Settings (Exact Match to uploaded reference image) */}
            {activeTab === 'profile' && (
              <>
                {/* 1. Top Profile Header Card */}
                <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                        Profile Settings
                      </h3>
                      <p className="text-xs text-[#698453] mt-0.5">
                        Update your personal information and profile details.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingHeader(!isEditingHeader)}
                      className="px-3.5 py-2 bg-white hover:bg-[#F4F8EF] text-[#233D19] border border-[#DCE6D2] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#587640]" />
                      <span>{isEditingHeader ? 'Editing Mode' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  {/* Profile Info Details Row */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                    {/* Circular Avatar with Camera Badge */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-[#385429] text-white font-extrabold text-2xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{fullName.charAt(0) || 'P'}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info('Avatar camera upload modal triggered')}
                        className="absolute bottom-0 right-0 w-7 h-7 bg-[#233D19] text-white rounded-full flex items-center justify-center border-2 border-white shadow-2xs hover:bg-[#385429] transition cursor-pointer"
                        title="Change Avatar"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#A3E635]" />
                      </button>
                    </div>

                    {/* Name, Role & Info */}
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#233D19]">
                          {fullName}
                        </h2>
                        <p className="text-xs font-bold text-[#698453]">{role}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#5C7847] pt-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#587640]" />
                          <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#587640]" />
                          <span>{phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#587640]" />
                          <span>{location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 3 KPI Summary Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Shipments */}
                  <div className="bg-[#F9FCF7] rounded-3xl p-4 border border-[#EEF4E8] shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#C8E6C9] flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#698453] font-semibold">Total Shipments</p>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#233D19]">
                        {stats.totalShipments.toLocaleString()}
                      </h4>
                      <p className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5 mt-0.5">
                        <span>↑ 12%</span>
                        <span className="text-[#698453] font-normal">vs. last month</span>
                      </p>
                    </div>
                  </div>

                  {/* Customers */}
                  <div className="bg-[#F9FCF7] rounded-3xl p-4 border border-[#EEF4E8] shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#C8E6C9] flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#698453] font-semibold">Customers</p>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#233D19]">
                        {stats.totalCustomers.toLocaleString()}
                      </h4>
                      <p className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5 mt-0.5">
                        <span>↑ 8%</span>
                        <span className="text-[#698453] font-normal">vs. last month</span>
                      </p>
                    </div>
                  </div>

                  {/* Deliveries */}
                  <div className="bg-[#F9FCF7] rounded-3xl p-4 border border-[#EEF4E8] shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#C8E6C9] flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#698453] font-semibold">Deliveries</p>
                      <h4 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#233D19]">
                        {stats.totalDeliveries.toLocaleString()}
                      </h4>
                      <p className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5 mt-0.5">
                        <span>↑ 15%</span>
                        <span className="text-[#698453] font-normal">vs. last month</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom 2-Column Section (Account Information & Preferences) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Account Information Form (7 Cols) */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19] border-b border-[#EEF4E8] pb-3 mb-4">
                        Account Information
                      </h3>

                      <form onSubmit={handleSaveChanges} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1">
                            Role
                          </label>
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 cursor-pointer transition"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Dispatcher">Dispatcher</option>
                            <option value="Customer">Customer</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                          <button
                            type="submit"
                            className="bg-[#2D5A27] hover:bg-[#23471E] text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelForm}
                            className="bg-white hover:bg-[#F4F8EF] border border-[#DCE6D2] text-[#233D19] px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Preferences Form (5 Cols) */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19] border-b border-[#EEF4E8] pb-3 mb-4">
                        Preferences
                      </h3>

                      <div className="space-y-4">
                        {/* Language */}
                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-[#587640]" />
                            <span>Language</span>
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none cursor-pointer"
                          >
                            <option value="English">English</option>
                            <option value="Telugu">Telugu (తెలుగు)</option>
                            <option value="Hindi">Hindi (हिंदी)</option>
                            <option value="Spanish">Spanish</option>
                          </select>
                        </div>

                        {/* Time Zone */}
                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#587640]" />
                            <span>Time Zone</span>
                          </label>
                          <select
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none cursor-pointer"
                          >
                            <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
                            <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                            <option value="(GMT-05:00) EST">(GMT-05:00) Eastern Time (US)</option>
                          </select>
                        </div>

                        {/* Date Format */}
                        <div>
                          <label className="block text-xs font-bold text-[#4A6437] mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#587640]" />
                            <span>Date Format</span>
                          </label>
                          <select
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value)}
                            className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none cursor-pointer"
                          >
                            <option value="DD MMM, YYYY (e.g. 24 Sep, 2026)">DD MMM, YYYY (e.g. 24 Sep, 2026)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        {/* Toggle Switches */}
                        <div className="pt-2 space-y-3">
                          {/* Email Notifications Toggle */}
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-xs text-[#233D19]">Enable Email Notifications</h5>
                              <p className="text-[10px] text-[#698453]">Get notified about new shipments and updates</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEnableEmailNotifs(!enableEmailNotifs)}
                              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                                enableEmailNotifs ? 'bg-[#2E7D32]' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  enableEmailNotifs ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Push Notifications Toggle */}
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-xs text-[#233D19]">Enable Push Notifications</h5>
                              <p className="text-[10px] text-[#698453]">Receive real-time alerts on your device</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEnablePushNotifs(!enablePushNotifs)}
                              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                                enablePushNotifs ? 'bg-[#2E7D32]' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  enablePushNotifs ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* TAB 2: Account Security */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    Account Security & Password
                  </h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A6437] mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A6437] mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A6437] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#233D19] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#2D5A27] hover:bg-[#23471E] text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xs transition cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Update Security Password</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: Notification Preferences */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <Bell className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    Notification Preferences
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#F9FCF7] rounded-2xl border border-[#EEF4E8]">
                    <div>
                      <h5 className="font-bold text-xs text-[#233D19]">Email Notifications</h5>
                      <p className="text-[11px] text-[#698453]">Get notified about new shipments and updates</p>
                    </div>
                    <input type="checkbox" checked={enableEmailNotifs} onChange={(e) => setEnableEmailNotifs(e.target.checked)} className="w-4 h-4 accent-[#2E7D32]" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#F9FCF7] rounded-2xl border border-[#EEF4E8]">
                    <div>
                      <h5 className="font-bold text-xs text-[#233D19]">Push Notifications</h5>
                      <p className="text-[11px] text-[#698453]">Receive real-time alerts on your device</p>
                    </div>
                    <input type="checkbox" checked={enablePushNotifs} onChange={(e) => setEnablePushNotifs(e.target.checked)} className="w-4 h-4 accent-[#2E7D32]" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Appearance */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <Palette className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    Appearance & Theme Settings
                  </h3>
                </div>
                <p className="text-xs text-[#698453]">Active Theme: <span className="font-bold text-[#233D19]">Deliverly Light Sage Green</span></p>
              </div>
            )}

            {/* TAB 5: System Configuration */}
            {activeTab === 'system' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <Sliders className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    System Configuration
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block mb-1 text-[#4A6437]">Default Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl p-2.5">
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="USD ($)">USD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-[#4A6437]">Tracking Prefix</label>
                    <input type="text" value={trackingPrefix} onChange={(e) => setTrackingPrefix(e.target.value)} className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl p-2.5" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: API Integrations */}
            {activeTab === 'integrations' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <Link2 className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    API & Carrier Integrations
                  </h3>
                </div>
                <div className="p-4 bg-[#F9FCF7] rounded-2xl border border-[#EEF4E8] flex justify-between items-center text-xs font-bold">
                  <span>Deliverly Express Direct API</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">Connected</span>
                </div>
              </div>
            )}

            {/* TAB 7: Backup & Data */}
            {activeTab === 'backup' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <Database className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    Backup & Application Data Reset
                  </h3>
                </div>
                <button type="button" onClick={handleResetData} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset Demo Data
                </button>
              </div>
            )}

            {/* TAB 8: Help & Support */}
            {activeTab === 'help' && (
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl">
                <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                  <HelpCircle className="w-5 h-5 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                    Help & Customer Support
                  </h3>
                </div>
                <button type="button" onClick={() => openSupportChat()} className="px-5 py-2.5 bg-[#233D19] text-white font-bold text-xs rounded-2xl">
                  Open Support AI Bot
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
