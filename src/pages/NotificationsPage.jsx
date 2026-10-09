import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Truck,
  Package,
  User,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Filter,
  Eye,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';
import {
  getActivitiesFromStorage,
  markActivityAsRead,
  markAllActivitiesAsRead
} from '../services/activityLogger';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { shipments = [] } = useShipments();
  const { customers = [] } = useCustomers();

  // Real-time logged activities state
  const [activities, setActivities] = useState(getActivitiesFromStorage());

  // Listen for real-time activity logs emitted anywhere across the app
  useEffect(() => {
    const handleLogEvent = () => {
      setActivities(getActivitiesFromStorage());
    };

    handleLogEvent();
    window.addEventListener('deliverly_activity_log', handleLogEvent);
    return () => window.removeEventListener('deliverly_activity_log', handleLogEvent);
  }, []);

  // Active Category Tab: 'All' | 'Shipments' | 'Customers' | 'System' | 'Alerts'
  const [activeTab, setActiveTab] = useState('All');

  // Filter Form States
  const [filterType, setFilterType] = useState('All Types');
  const [filterDateRange, setFilterDateRange] = useState('Last 7 Days');
  const [appliedTypeFilter, setAppliedTypeFilter] = useState('All Types');
  const [appliedDateFilter, setAppliedDateFilter] = useState('Last 7 Days');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Combine real-time logged actions with dynamic shipments & customers
  const mergedNotifications = useMemo(() => {
    const list = [];
    const seenIds = new Set();

    // 1. Process real-time logged activity events (Create, Edit, Status Change, Delete, Sync)
    activities.forEach((act) => {
      if (seenIds.has(act.id)) return;
      seenIds.add(act.id);

      let icon = FileText;
      let iconBg = 'bg-[#E8F5E9]';
      let iconColor = 'text-[#388E3C]';
      let dotColor = act.unread !== false ? 'bg-emerald-500' : null;

      if (act.type === 'shipment_create') {
        icon = Package;
        iconBg = 'bg-[#E3F2FD]';
        iconColor = 'text-[#1976D2]';
        dotColor = act.unread !== false ? 'bg-blue-500' : null;
      } else if (act.type === 'shipment_deliver') {
        icon = Truck;
        iconBg = 'bg-[#E8F5E9]';
        iconColor = 'text-[#2E7D32]';
        dotColor = act.unread !== false ? 'bg-emerald-500' : null;
      } else if (act.type === 'shipment_update' || act.type === 'shipment_status') {
        icon = Truck;
        iconBg = 'bg-[#E0F2F1]';
        iconColor = 'text-[#00897B]';
        dotColor = act.unread !== false ? 'bg-teal-500' : null;
      } else if (act.type === 'shipment_delete') {
        icon = Trash2;
        iconBg = 'bg-[#FFEBEE]';
        iconColor = 'text-[#E53935]';
        dotColor = act.unread !== false ? 'bg-red-500' : null;
      } else if (act.type.startsWith('customer')) {
        icon = User;
        iconBg = 'bg-[#F3E5F5]';
        iconColor = 'text-[#7B1FA2]';
        dotColor = act.unread !== false ? 'bg-purple-500' : null;
      }

      list.push({
        id: act.id,
        title: act.title,
        category: act.category || (act.type.startsWith('shipment') ? 'Shipment' : act.type.startsWith('customer') ? 'Customer' : 'System'),
        description: act.subtitle || 'System activity logged.',
        time: act.time || 'Recently',
        timestamp: act.timestamp || Date.now(),
        trackingNo: act.trackingNo,
        unread: act.unread !== false,
        icon,
        iconBg,
        iconColor,
        dotColor
      });
    });

    // 2. Add existing live shipments if not already logged
    shipments.slice(0, 6).forEach((s, idx) => {
      const synId = `ship-syn-${s.id}`;
      if (seenIds.has(synId)) return;
      seenIds.add(synId);

      list.push({
        id: synId,
        title: s.status === 'Delivered' ? 'Shipment Delivered' : `Shipment ${s.status}`,
        category: s.status === 'Cancelled' ? 'Alert' : 'Shipment',
        description: `Shipment ${s.trackingNo} for ${s.receiver || s.sender} is currently ${s.status.toLowerCase()}.`,
        time: `${(idx + 1) * 15}m ago`,
        timestamp: Date.now() - (idx + 1) * 900000,
        trackingNo: s.trackingNo,
        unread: idx < 2,
        icon: s.status === 'Delivered' ? CheckCircle2 : Truck,
        iconBg: s.status === 'Delivered' ? 'bg-[#E8F5E9]' : 'bg-[#E3F2FD]',
        iconColor: s.status === 'Delivered' ? 'text-[#2E7D32]' : 'text-[#1976D2]',
        dotColor: idx < 2 ? 'bg-[#2E7D32]' : null
      });
    });

    // Sort by latest timestamp
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [activities, shipments, customers]);

  // Tab Counts
  const tabCounts = useMemo(() => {
    return {
      All: mergedNotifications.length,
      Shipments: mergedNotifications.filter((n) => n.category === 'Shipment').length,
      Customers: mergedNotifications.filter((n) => n.category === 'Customer').length,
      System: mergedNotifications.filter((n) => n.category === 'System').length,
      Alerts: mergedNotifications.filter((n) => n.category === 'Alert').length
    };
  }, [mergedNotifications]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return mergedNotifications.filter((item) => {
      // Category Tab filter
      if (activeTab === 'Shipments' && item.category !== 'Shipment') return false;
      if (activeTab === 'Customers' && item.category !== 'Customer') return false;
      if (activeTab === 'System' && item.category !== 'System') return false;
      if (activeTab === 'Alerts' && item.category !== 'Alert') return false;

      // Dropdown type filter
      if (appliedTypeFilter === 'Shipment' && item.category !== 'Shipment') return false;
      if (appliedTypeFilter === 'Customer' && item.category !== 'Customer') return false;
      if (appliedTypeFilter === 'System' && item.category !== 'System') return false;
      if (appliedTypeFilter === 'Alert' && item.category !== 'Alert') return false;

      return true;
    });
  }, [mergedNotifications, activeTab, appliedTypeFilter, appliedDateFilter]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = mergedNotifications.length;
    const shipmentUpdates = mergedNotifications.filter((n) => n.category === 'Shipment').length;
    const customerUpdates = mergedNotifications.filter((n) => n.category === 'Customer').length;
    const alerts = mergedNotifications.filter((n) => n.category === 'Alert').length;

    return { total, shipmentUpdates, customerUpdates, alerts };
  }, [mergedNotifications]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  const handleApplyFilter = () => {
    setAppliedTypeFilter(filterType);
    setAppliedDateFilter(filterDateRange);
    setCurrentPage(1);
    toast.info(`Applied filter: ${filterType} (${filterDateRange})`);
  };

  const handleMarkAllRead = () => {
    markAllActivitiesAsRead();
    toast.success('All notifications marked as read!');
  };

  const handleItemClick = (notif) => {
    markActivityAsRead(notif.id);
    if (notif.trackingNo) {
      navigate(`/tracking?trackingNo=${notif.trackingNo}`);
      toast.info(`Opening live tracking for ${notif.trackingNo}`);
    } else {
      toast.info(`Marked as read: ${notif.title}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-['Inter'] text-[#233D19] pb-10">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
              <Bell className="w-6 h-6 text-[#233D19]" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                Stay updated with live activities, shipment status edits, creates and real-time alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Category Tabs + Feed List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Category Filter Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: 'All', key: 'All', count: tabCounts.All },
                { label: 'Shipments', key: 'Shipments', count: tabCounts.Shipments },
                { label: 'Customers', key: 'Customers', count: tabCounts.Customers },
                { label: 'System', key: 'System', count: tabCounts.System },
                { label: 'Alerts', key: 'Alerts', count: tabCounts.Alerts }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#233D19] text-white shadow-sm'
                        : 'bg-white hover:bg-[#EAF3D8] text-[#4A6437] border border-[#DCE6D2]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-[#385429] text-white' : 'bg-[#EAF3D8] text-[#233D19]'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Notification Stream Card Container */}
            <div className="bg-white rounded-3xl border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-[#EEF4E8]">
              {paginatedNotifications.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F4F8EF] text-[#7A9560] flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#233D19]">No notifications found</p>
                  <p className="text-xs text-[#698453]">Try changing your category tab or filter options.</p>
                </div>
              ) : (
                paginatedNotifications.map((notif) => {
                  const IconComp = notif.icon;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleItemClick(notif)}
                      className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition cursor-pointer ${
                        notif.unread ? 'bg-[#F9FCF7] hover:bg-[#F0F6E8]' : 'bg-white opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Circle Icon Container */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${notif.iconBg} ${notif.iconColor}`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs sm:text-sm text-[#233D19]">
                              {notif.title}
                            </h4>
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                notif.category === 'Shipment'
                                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                  : notif.category === 'Customer'
                                  ? 'bg-[#F3E5F5] text-[#7B1FA2]'
                                  : notif.category === 'Alert'
                                  ? 'bg-[#FFF3E0] text-[#E65100]'
                                  : 'bg-[#E0F2F1] text-[#00897B]'
                              }`}
                            >
                              {notif.category}
                            </span>
                          </div>

                          <p className="text-xs text-[#5C7847] leading-relaxed line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta Info */}
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-[11px] font-semibold text-[#7A9560]">
                          {notif.time}
                        </span>

                        {/* Unread Indicator Dot */}
                        {notif.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}

                        <ChevronRight className="w-4 h-4 text-[#A3C986]" />
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination Footer */}
              <div className="p-4 bg-white border-t border-[#EEF4E8] flex items-center justify-between text-xs font-semibold text-[#698453]">
                <span>
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredNotifications.length)} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)} of {filteredNotifications.length} notifications
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="w-7 h-7 rounded-lg border border-[#DCE6D2] hover:bg-[#F0F5EC] disabled:opacity-40 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#233D19]" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === pg
                          ? 'bg-[#2E7D32] text-white shadow-2xs'
                          : 'border border-[#DCE6D2] text-[#233D19] hover:bg-[#F0F5EC]'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="w-7 h-7 rounded-lg border border-[#DCE6D2] hover:bg-[#F0F5EC] disabled:opacity-40 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-[#233D19]" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Summary + Filter Widget + Mark All Read + Leaf Banner (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Widget 1: Notification Summary */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                <Bell className="w-4 h-4 text-[#385429]" />
                <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19]">
                  Notification Summary
                </h3>
              </div>

              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center border border-[#FFE0B2]">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
                    {summaryMetrics.total}
                  </div>
                  <p className="text-[10px] text-[#698453] font-medium">Total Notifications</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#C8E6C9]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
                    {summaryMetrics.shipmentUpdates}
                  </div>
                  <p className="text-[10px] text-[#698453] font-medium">Shipment Updates</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center border border-[#E1BEE7]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
                    {summaryMetrics.customerUpdates}
                  </div>
                  <p className="text-[10px] text-[#698453] font-medium">Customer Updates</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-1">
                  <div className="w-7 h-7 rounded-xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center border border-[#FFE0B2]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
                    {summaryMetrics.alerts}
                  </div>
                  <p className="text-[10px] text-[#698453] font-medium">Alerts & Warnings</p>
                </div>
              </div>
            </div>

            {/* Widget 2: Filter Notifications */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EEF4E8] pb-3">
                <Filter className="w-4 h-4 text-[#385429]" />
                <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19]">
                  Filter Notifications
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A6437] mb-1">
                    Notification Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3 py-2 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 cursor-pointer"
                  >
                    <option value="All Types">All Types</option>
                    <option value="Shipment">Shipment</option>
                    <option value="Customer">Customer</option>
                    <option value="System">System</option>
                    <option value="Alert">Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A6437] mb-1">
                    Date Range
                  </label>
                  <select
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                    className="w-full bg-[#F9FCF7] border border-[#DCE6D2] rounded-2xl px-3 py-2 text-xs font-bold text-[#233D19] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 cursor-pointer"
                  >
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Today">Today</option>
                    <option value="This Month">This Month</option>
                    <option value="All Time">All Time</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-full bg-[#2D5A27] hover:bg-[#23471E] text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Filter</span>
                </button>
              </div>
            </div>

            {/* Widget 3: Mark All as Read */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#385429]" />
                <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19]">
                  Mark All as Read
                </h3>
              </div>
              <p className="text-xs text-[#698453]">Clear all unread notifications</p>

              <button
                type="button"
                onClick={handleMarkAllRead}
                className="w-full border border-[#587640] text-[#233D19] hover:bg-[#F0F5EC] py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#2E7D32]" />
                <span>Mark All as Read</span>
              </button>
            </div>

            {/* Widget 4: Leaf Promo Banner */}
            <div className="bg-gradient-to-br from-[#EAF3D8] to-[#DCE8C8] rounded-3xl p-5 border border-[#CDE0B8] relative overflow-hidden flex items-center justify-between shadow-2xs">
              <div className="space-y-1 z-10">
                <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center border border-[#CDE0B8]">
                  <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19] leading-snug">
                  Stay Informed<br />Deliver Better
                </h4>
              </div>

              <div className="w-16 h-16 bg-white/80 backdrop-blur-xs rounded-2xl flex items-center justify-center border border-[#CDE0B8] shadow-2xs z-10">
                <Package className="w-8 h-8 text-[#2E7D32]" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
