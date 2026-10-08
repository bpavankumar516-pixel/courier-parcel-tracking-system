import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  ChevronDown,
  ArrowRight,
  Phone,
  MapPin,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Search,
  Filter,
  User,
  Scale,
  Tag,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';
import { useSupport } from '../context/SupportContext';

const DeliveryStatusPage = () => {
  const [searchParams] = useSearchParams();
  const { shipments = [], updateShipmentStatus } = useShipments();
  const { customers = [] } = useCustomers();
  const { openSupportChat } = useSupport();

  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Sep 24, 2026 - Sep 30, 2026');

  // Dynamically filter recent shipments list
  const filteredShipmentsList = useMemo(() => {
    return shipments.filter((item) => {
      const q = tableSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.trackingNo.toLowerCase().includes(q) ||
        item.sender.toLowerCase().includes(q) ||
        item.receiver.toLowerCase().includes(q);

      const matchesStatus =
        tableStatusFilter === 'All' || item.status === tableStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [shipments, tableSearch, tableStatusFilter]);

  // URL tracking parameter or default to top shipment
  const trackingNoFromUrl = searchParams.get('trackingNo');

  // Currently selected shipment for map inspection & right sidebar drawer
  const [selectedShipmentNo, setSelectedShipmentNo] = useState(() => {
    if (trackingNoFromUrl) return trackingNoFromUrl;
    return shipments.length > 0 ? shipments[0].trackingNo : 'TRK20250829001';
  });

  useEffect(() => {
    if (trackingNoFromUrl) {
      setSelectedShipmentNo(trackingNoFromUrl);
    }
  }, [trackingNoFromUrl]);

  const getCurrentLocationForStatus = (status, pickupAddress, deliveryAddress) => {
    switch (status) {
      case 'Pending':
      case 'Shipment Created':
        return pickupAddress ? `Origin Hub: ${pickupAddress}` : 'Origin Logistics Dispatch Terminal';
      case 'Picked Up':
        return pickupAddress ? `Pickup Location: ${pickupAddress}` : 'Courier Pickup Hub';
      case 'In Transit':
        return 'Sorting Facility: Central Transit Hub #42 (JFK Logistics Park)';
      case 'Out for Delivery':
        return deliveryAddress ? `Local Delivery Station near ${deliveryAddress}` : 'Local Delivery Dispatch Hub';
      case 'Delivered':
        return deliveryAddress ? `Final Destination: ${deliveryAddress}` : 'Recipient Handover Location';
      case 'Cancelled':
        return 'Logistics Operations Office - Order Cancelled';
      case 'Failed Delivery':
        return 'Regional Dispatch Terminal - Recipient Unavailable';
      default:
        return pickupAddress ? `In Transit via ${pickupAddress}` : 'Regional Logistics Hub';
    }
  };

  // Derive active selected shipment object from context
  const activeShipment = useMemo(() => {
    const found = shipments.find(
      (s) => s.trackingNo.toLowerCase() === selectedShipmentNo.toLowerCase() || s.id === selectedShipmentNo
    );

    if (found) {
      const cust = customers.find((c) => c.name.toLowerCase() === found.sender?.toLowerCase());
      const loc = getCurrentLocationForStatus(found.status, found.pickupAddress, found.deliveryAddress);
      return {
        ...found,
        phone: cust?.phone || found.senderPhone || '+1 555-0192',
        from: found.pickupAddress ? found.pickupAddress.split(',')[1] || found.pickupAddress : 'Origin Address',
        to: found.deliveryAddress ? found.deliveryAddress.split(',')[1] || found.deliveryAddress : 'Destination Address',
        currentLocation: loc,
        lastUpdated: `${found.shippingDate || 'Aug 29, 2026'} • Verified Checkpoint Scan`
      };
    }

    // Default reference active shipment matching live shipment schema
    return {
      id: 'def-status-1',
      trackingNo: selectedShipmentNo || 'TRK20250829001',
      sender: 'John Doe',
      phone: '+1 555-0192',
      receiver: 'Sarah Wilson',
      from: 'New York, NY',
      to: 'San Francisco, CA',
      weight: '2.5 kg',
      type: 'Electronics',
      shippingDate: 'Aug 29, 2026',
      expectedDelivery: 'Sep 02, 2026',
      status: 'In Transit',
      currentLocation: 'Sorting Facility: Central Transit Hub #42 (JFK Logistics Park)',
      lastUpdated: 'Aug 31, 2026 • Verified Checkpoint Scan'
    };
  }, [shipments, customers, selectedShipmentNo]);

  // KPI Metrics calculated dynamically
  const metrics = useMemo(() => {
    const total = shipments.length > 0 ? shipments.length : 2486;
    const inTransit = shipments.filter((s) => s.status === 'In Transit').length || 1248;
    const delivered = shipments.filter((s) => s.status === 'Delivered').length || 1023;
    const pending = shipments.filter((s) => s.status === 'Pending' || s.status === 'Out for Delivery').length || 215;
    const failed = shipments.filter((s) => s.status === 'Failed Delivery' || s.status === 'Cancelled').length || 48;

    return { total, inTransit, delivered, pending, failed };
  }, [shipments]);

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return 'bg-[#E3F2FD] text-[#0066CC] border border-[#B3E5FC]';
      case 'Picked Up':
      case 'Delivered':
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'Out for Delivery':
        return 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE082]';
      case 'Pending':
        return 'bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]';
      case 'Cancelled':
      case 'Failed Delivery':
        return 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]';
      default:
        return 'bg-[#EAF3D8] text-[#587640] border border-[#DCE6D2]';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-['Inter']">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-[#233D19]" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                Delivery Status
              </h1>
              <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                Track and manage the current status of your shipments in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Date Selector Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#DCE6D2] text-xs font-bold text-[#233D19] shadow-2xs">
              <Calendar className="w-4 h-4 text-[#587640]" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  toast.info(`Filtered delivery status for ${e.target.value}`);
                }}
                className="bg-transparent font-bold cursor-pointer focus:outline-none text-[#233D19]"
              >
                <option value="Sep 24, 2026 - Sep 30, 2026">Sep 24, 2026 - Sep 30, 2026</option>
                <option value="Sep 1, 2026 - Sep 23, 2026">Sep 1, 2026 - Sep 23, 2026</option>
                <option value="Aug 1, 2026 - Aug 31, 2026">Aug 1, 2026 - Aug 31, 2026</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            {/* Quick Refresh Button */}
            <button
              type="button"
              onClick={() => toast.info('Refreshed real-time delivery status feeds!')}
              className="p-2.5 bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-2xl border border-[#23471E] shadow-2xs transition cursor-pointer"
              title="Refresh Feeds"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Shipments */}
          <div className="bg-white rounded-3xl p-4 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF3D8] flex items-center justify-center text-[#233D19] border border-[#DCE6D2]">
                <Package className="w-4.5 h-4.5 text-[#385429]" />
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                12% vs last week
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#698453] font-medium block">Total Shipments</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.total.toLocaleString()}
              </h3>
            </div>
            <div className="h-7 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 25 Q 20 18, 40 22 T 80 10 T 100 5" fill="none" stroke="#2E7D32" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 2: In Transit */}
          <div className="bg-white rounded-3xl p-4 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#E3F2FD] flex items-center justify-center text-[#0066CC] border border-[#B3E5FC]">
                <Truck className="w-4.5 h-4.5 text-[#0066CC]" />
              </div>
              <span className="text-[10px] font-bold text-[#0066CC] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                8% vs last week
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#698453] font-medium block">In Transit</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.inTransit.toLocaleString()}
              </h3>
            </div>
            <div className="h-7 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 22 Q 30 28, 60 15 T 100 5" fill="none" stroke="#0066CC" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 3: Delivered */}
          <div className="bg-white rounded-3xl p-4 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] border border-[#C8E6C9]">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#2E7D32]" />
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                15% vs last week
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#698453] font-medium block">Delivered</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.delivered.toLocaleString()}
              </h3>
            </div>
            <div className="h-7 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 25 Q 30 20, 60 12 T 100 4" fill="none" stroke="#2E7D32" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 4: Pending */}
          <div className="bg-white rounded-3xl p-4 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#FFF3E0] flex items-center justify-center text-[#E65100] border border-[#FFE082]">
                <Clock className="w-4.5 h-4.5 text-[#E65100]" />
              </div>
              <span className="text-[10px] font-bold text-[#E65100] flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                5% vs last week
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#698453] font-medium block">Pending</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.pending.toLocaleString()}
              </h3>
            </div>
            <div className="h-7 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 10 Q 40 5, 70 20 T 100 24" fill="none" stroke="#E65100" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 5: Failed / Exception */}
          <div className="bg-white rounded-3xl p-4 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#FFEBEE] flex items-center justify-center text-[#C62828] border border-[#FFCDD2]">
                <AlertCircle className="w-4.5 h-4.5 text-[#C62828]" />
              </div>
              <span className="text-[10px] font-bold text-[#C62828] flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                3% vs last week
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#698453] font-medium block">Failed / Exception</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.failed.toLocaleString()}
              </h3>
            </div>
            <div className="h-7 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 12 Q 30 18, 60 10 T 100 25" fill="none" stroke="#C62828" strokeWidth="2" />
              </svg>
            </div>
          </div>

        </div>

        {/* Middle Section (2 Main Columns Layout: Recent Shipments & Selected Shipment Drawer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Recent Shipments List Table (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            
            {/* Header with Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF4E8] pb-3.5">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                  Recent Shipments
                </h3>
                <p className="text-[11px] text-[#698453]">Select any shipment to inspect full journey status</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Box */}
                <div className="flex items-center border border-[#DCE6D2] rounded-xl px-2.5 py-1.5 bg-[#F9FCF7] focus-within:border-[#587640] transition">
                  <Search className="w-3.5 h-3.5 text-[#587640] mr-1.5" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search shipment..."
                    className="bg-transparent text-xs font-bold text-[#233D19] focus:outline-none placeholder:text-[#93A782] w-28 sm:w-36"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={tableStatusFilter}
                  onChange={(e) => setTableStatusFilter(e.target.value)}
                  className="text-xs font-bold bg-[#F4F8EF] border border-[#DCE6D2] rounded-xl px-2.5 py-1.5 text-[#233D19] cursor-pointer focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed Delivery">Failed Delivery</option>
                </select>

                <Link
                  to="/shipments"
                  className="text-xs font-bold text-[#587640] hover:underline flex items-center gap-1 cursor-pointer pl-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Rich Detailed Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs font-['Inter']">
                <thead>
                  <tr className="border-b border-[#EEF4E8] text-[#7A9560] uppercase text-[10px] font-extrabold tracking-wider bg-[#F9FCF7]">
                    <th className="py-2.5 px-3 rounded-l-xl">Tracking No.</th>
                    <th className="py-2.5 px-3">Sender / Customer</th>
                    <th className="py-2.5 px-3">Receiver</th>
                    <th className="py-2.5 px-3">Type & Weight</th>
                    <th className="py-2.5 px-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF4E8]">
                  {filteredShipmentsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-xs text-[#93A782] font-semibold">
                        No matching shipments found. Try clearing filters.
                      </td>
                    </tr>
                  ) : (
                    filteredShipmentsList.slice(0, 8).map((item) => {
                      const isSelected = selectedShipmentNo === item.trackingNo;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedShipmentNo(item.trackingNo)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#EAF3D8] font-bold border-l-4 border-l-[#2E7D32]'
                              : 'hover:bg-[#F4F8EF]'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-[#587640]" />
                              <span className="font-mono font-extrabold text-[#233D19] text-[11px]">
                                {item.trackingNo}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#233D19] block">{item.sender}</span>
                            <span className="text-[10px] text-[#698453]">{item.senderPhone || item.senderEmail}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#233D19] block">{item.receiver}</span>
                            <span className="text-[10px] text-[#698453]">
                              {item.deliveryAddress ? item.deliveryAddress.split(',')[1] || 'Destination' : 'Destination'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#233D19] font-medium">
                            <span className="font-bold">{item.type}</span> • {item.weight}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full ${getStatusBadge(item.status)}`}>
                              ● {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Selected Shipment Drawer Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 font-['Inter']">
            
            {/* Header with status badge */}
            <div>
              <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF3D8] text-[#233D19] flex items-center justify-center border border-[#DCE6D2]">
                    <Truck className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-extrabold text-[#233D19]">
                      {activeShipment.trackingNo}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full ${getStatusBadge(activeShipment.status)}`}>
                    ● {activeShipment.status}
                  </span>
                  <button type="button" className="text-[#7A9560] hover:text-[#233D19] p-1 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Stepper Progress Nodes */}
              <div className="bg-[#F9FCF7] p-3 rounded-2xl border border-[#EEF4E8] space-y-2 mb-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#698453]">
                  <span>Picked Up</span>
                  <span>In Transit</span>
                  <span>Out for Delivery</span>
                  <span>Delivered</span>
                </div>
                
                {/* Visual Line */}
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#DCE6D2] z-0" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2E7D32] z-10 ring-2 ring-white" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#2E7D32] z-10 ring-2 ring-white animate-pulse" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#DCE6D2] z-10 ring-2 ring-white" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#DCE6D2] z-10 ring-2 ring-white" />
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#789564]">
                  <span>Sep 24</span>
                  <span>Sep 25</span>
                  <span>--</span>
                  <span>--</span>
                </div>
              </div>

              {/* Shipment Key Details List */}
              <div className="space-y-2.5 border-b border-[#EEF4E8] pb-3 text-xs">
                <h5 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#233D19] uppercase tracking-wider">
                  Shipment Details
                </h5>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Customer Name</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.sender || 'John Doe'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Phone</span>
                  <a href={`tel:${activeShipment.phone}`} className="font-bold text-[#587640] hover:underline">
                    {activeShipment.phone}
                  </a>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">From</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.from}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">To</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.to}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Weight</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.weight || '2.5 kg'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Parcel Type</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.type || 'Electronics'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Shipping Date</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.shippingDate || 'Sep 24, 2026'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#698453]">Expected Delivery</span>
                  <span className="font-bold text-[#233D19]">{activeShipment.expectedDelivery || 'Sep 26, 2026'}</span>
                </div>
              </div>

              {/* Current Location Box */}
              <div className="mt-3 p-3 rounded-2xl bg-[#F9FCF7] border border-[#DCE6D2] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#233D19]">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Current Location</span>
                </div>
                <p className="text-xs font-bold text-[#385429] pl-5">
                  {activeShipment.currentLocation}
                </p>
                <p className="text-[10px] text-[#789564] pl-5">
                  Last updated: {activeShipment.lastUpdated}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Link
                to={`/tracking?trackingNo=${activeShipment.trackingNo}`}
                className="w-full bg-[#2D5A27] hover:bg-[#23471E] text-white py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Full Tracking</span>
              </Link>

              <button
                type="button"
                onClick={() => openSupportChat(activeShipment?.trackingNo)}
                className="w-full bg-white hover:bg-[#F4F7EF] border border-[#DCE6D2] text-[#233D19] py-2 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#587640]" />
                <span>Contact Support</span>
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Section (2 Cards Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Delivery Performance (4 Radial Gauges - 8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Delivery Performance
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              
              {/* Gauge 1: On-Time Delivery */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EEF4E8" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2E7D32" strokeWidth="3" strokeDasharray="96.8, 100" />
                  </svg>
                  <span className="absolute font-extrabold text-xs text-[#233D19]">96.8%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#233D19] block">On-Time Delivery</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold">↑ 12%</span>
                </div>
              </div>

              {/* Gauge 2: First Attempt Success */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EEF4E8" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2E7D32" strokeWidth="3" strokeDasharray="93.2, 100" />
                  </svg>
                  <span className="absolute font-extrabold text-xs text-[#233D19]">93.2%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#233D19] block">First Attempt Success</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold">↑ 8%</span>
                </div>
              </div>

              {/* Gauge 3: Customer Satisfaction */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EEF4E8" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2E7D32" strokeWidth="3" strokeDasharray="98.5, 100" />
                  </svg>
                  <span className="absolute font-extrabold text-xs text-[#233D19]">98.5%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#233D19] block">Customer Satisfaction</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold">↑ 6%</span>
                </div>
              </div>

              {/* Gauge 4: Return Rate */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] space-y-2">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EEF4E8" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E65100" strokeWidth="3" strokeDasharray="2.1, 100" />
                  </svg>
                  <span className="absolute font-extrabold text-xs text-[#233D19]">2.1%</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#233D19] block">Return Rate</span>
                  <span className="text-[10px] text-[#E65100] font-bold">↓ 3%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Faster Deliveries Promo Banner (4 Cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#EAF3D8] via-[#DCE8C8] to-[#CDE0B8] rounded-3xl p-6 border border-[#CDE0B8] flex items-center gap-4 shadow-2xs relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#233D19] border border-[#DCE6D2] shadow-2xs flex-shrink-0">
              <Package className="w-7 h-7 text-[#385429]" />
            </div>
            <div>
              <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19] leading-snug">
                Faster Deliveries<br />Happier Customers
              </h4>
              <p className="text-xs font-semibold text-[#587640] mt-1">Track. Deliver. Grow.</p>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DeliveryStatusPage;
