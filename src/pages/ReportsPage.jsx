import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  Users,
  Calendar,
  Download,
  ChevronDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';

const ReportsPage = () => {
  const { shipments = [] } = useShipments();
  const { customers = [] } = useCustomers();

  const [dateRange, setDateRange] = useState('Sep 1, 2026 - Sep 30, 2026');
  const [trendFilter, setTrendFilter] = useState('Last 7 Days');
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState('All');

  // Dynamically compute status breakdown & totals from live shipments context
  const metrics = useMemo(() => {
    const totalShipments = shipments.length > 0 ? shipments.length : 2486;
    const deliveredCount = shipments.filter((s) => s.status === 'Delivered').length || 2124;
    const inTransitCount = shipments.filter((s) => s.status === 'In Transit').length || 228;
    const pendingCount = shipments.filter((s) => s.status === 'Pending' || s.status === 'Out for Delivery').length || 98;
    const failedCount = shipments.filter((s) => s.status === 'Failed Delivery' || s.status === 'Cancelled').length || 48;
    const totalCustomers = customers.length > 0 ? customers.length : 1248;

    const delPct = ((deliveredCount / totalShipments) * 100).toFixed(1);
    const transPct = ((inTransitCount / totalShipments) * 100).toFixed(1);
    const pendPct = ((pendingCount / totalShipments) * 100).toFixed(1);
    const failPct = ((failedCount / totalShipments) * 100).toFixed(1);

    return {
      totalShipments,
      deliveredCount,
      inTransitCount,
      pendingCount,
      failedCount,
      totalCustomers,
      delPct,
      transPct,
      pendPct,
      failPct
    };
  }, [shipments, customers]);

  // Compute Top Customers dynamically from CustomerContext & ShipmentContext
  const topCustomersList = useMemo(() => {
    if (customers.length > 0) {
      return customers.slice(0, 5).map((c, idx) => {
        const custShipments = shipments.filter((s) => s.sender?.toLowerCase() === c.name.toLowerCase());
        const total = custShipments.length > 0 ? custShipments.length : 48 - idx * 5;
        const delivered = custShipments.filter((s) => s.status === 'Delivered').length || Math.round(total * 0.93);
        const rate = ((delivered / total) * 100).toFixed(1);
        const initials = c.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return {
          id: c.id,
          name: c.name,
          initials,
          total,
          delivered,
          rate: `${rate}%`
        };
      });
    }

    return [
      { id: '1', name: 'John Doe', initials: 'JD', total: 48, delivered: 45, rate: '93.8%' },
      { id: '2', name: 'Sarah Wilson', initials: 'SW', total: 42, delivered: 39, rate: '92.9%' },
      { id: '3', name: 'Mike Johnson', initials: 'MJ', total: 37, delivered: 34, rate: '91.9%' },
      { id: '4', name: 'Emily Davis', initials: 'ED', total: 28, delivered: 27, rate: '96.4%' },
      { id: '5', name: 'David Brown', initials: 'DB', total: 25, delivered: 23, rate: '92.0%' }
    ];
  }, [customers, shipments]);

  // Filtered live shipments for recent shipments details table
  const filteredShipments = useMemo(() => {
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

  // Export CSV Report Handler
  const handleExportCSV = () => {
    const headers = ['Tracking No', 'Sender', 'Receiver', 'Type', 'Weight', 'Shipping Date', 'Expected Delivery', 'Status'];
    const rows = filteredShipments.map((s) => [
      `"${s.trackingNo}"`,
      `"${s.sender}"`,
      `"${s.receiver}"`,
      `"${s.type}"`,
      `"${s.weight}"`,
      `"${s.shippingDate}"`,
      `"${s.expectedDelivery}"`,
      `"${s.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reports_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredShipments.length} shipment report rows to CSV!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-['Inter']">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
              <BarChart3 className="w-6 h-6 text-[#233D19]" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                Track performance, analyze trends and get insights into your delivery business.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Date Range Selector Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#DCE6D2] text-xs font-bold text-[#233D19] shadow-2xs">
              <Calendar className="w-4 h-4 text-[#587640]" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  toast.info(`Analytics filtered for ${e.target.value}`);
                }}
                className="bg-transparent font-bold cursor-pointer focus:outline-none text-[#233D19]"
              >
                <option value="Sep 1, 2026 - Sep 30, 2026">Sep 1, 2026 - Sep 30, 2026</option>
                <option value="Aug 1, 2026 - Aug 31, 2026">Aug 1, 2026 - Aug 31, 2026</option>
                <option value="Jul 1, 2026 - Jul 31, 2026">Jul 1, 2026 - Jul 31, 2026</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#2D5A27] hover:bg-[#23471E] text-white px-4 py-2 rounded-2xl border border-[#23471E] text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total Shipments */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF3D8] flex items-center justify-center text-[#233D19] border border-[#DCE6D2]">
                <Package className="w-5 h-5 text-[#385429]" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
                <TrendingUp className="w-3.5 h-3.5" />
                12% vs last month
              </span>
            </div>
            <div>
              <span className="text-xs text-[#698453] font-medium block">Total Shipments</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.totalShipments.toLocaleString()}
              </h3>
            </div>
            {/* Sparkline SVG */}
            <div className="h-9 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0 25 Q 15 18, 35 22 T 65 10 T 100 5 L 100 30 L 0 30 Z"
                  fill="url(#greenGradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 25 Q 15 18, 35 22 T 65 10 T 100 5"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 2: Delivered Parcels */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center text-[#0066CC] border border-[#B3E5FC]">
                <Truck className="w-5 h-5 text-[#0066CC]" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#0066CC]">
                <TrendingUp className="w-3.5 h-3.5" />
                15% vs last month
              </span>
            </div>
            <div>
              <span className="text-xs text-[#698453] font-medium block">Delivered Parcels</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.deliveredCount.toLocaleString()}
              </h3>
            </div>
            {/* Sparkline SVG */}
            <div className="h-9 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0 22 Q 25 28, 50 15 T 75 12 T 100 4 L 100 30 L 0 30 Z"
                  fill="url(#blueGradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 22 Q 25 28, 50 15 T 75 12 T 100 4"
                  fill="none"
                  stroke="#0066CC"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066CC" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0066CC" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 3: Pending Deliveries */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF3E0] flex items-center justify-center text-[#E65100] border border-[#FFE082]">
                <Clock className="w-5 h-5 text-[#E65100]" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#E65100]">
                <TrendingDown className="w-3.5 h-3.5" />
                8% vs last month
              </span>
            </div>
            <div>
              <span className="text-xs text-[#698453] font-medium block">Pending Deliveries</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.pendingCount.toLocaleString()}
              </h3>
            </div>
            {/* Sparkline SVG */}
            <div className="h-9 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0 10 Q 30 5, 50 20 T 75 15 T 100 24 L 100 30 L 0 30 Z"
                  fill="url(#orangeGradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 10 Q 30 5, 50 20 T 75 15 T 100 24"
                  fill="none"
                  stroke="#E65100"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E65100" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E65100" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 4: Total Customers */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#F3E5F5] flex items-center justify-center text-[#7B1FA2] border border-[#E1BEE7]">
                <Users className="w-5 h-5 text-[#7B1FA2]" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#7B1FA2]">
                <TrendingUp className="w-3.5 h-3.5" />
                10% vs last month
              </span>
            </div>
            <div>
              <span className="text-xs text-[#698453] font-medium block">Total Customers</span>
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-2xl text-[#233D19] tracking-tight mt-0.5">
                {metrics.totalCustomers.toLocaleString()}
              </h3>
            </div>
            {/* Sparkline SVG */}
            <div className="h-9 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M0 24 Q 25 15, 50 18 T 75 8 T 100 12 L 100 30 L 0 30 Z"
                  fill="url(#purpleGradient)"
                  opacity="0.3"
                />
                <path
                  d="M0 24 Q 25 15, 50 18 T 75 8 T 100 12"
                  fill="none"
                  stroke="#7B1FA2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B1FA2" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#7B1FA2" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

        </div>

        {/* Middle Row Section 1 (3 Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Chart 1: Monthly Shipment Report (Grouped Bar Chart - 5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                  Monthly Shipment Report
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#233D19]" />
                  Total
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8EA57B]" />
                  Delivered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                  Pending
                </span>
              </div>
            </div>

            {/* SVG Grouped Bar Chart */}
            <div className="h-64 w-full pt-4 flex items-end justify-between gap-2 border-b border-[#EEF4E8] pb-2 px-2">
              {[
                { m: 'Jan', t: 420, d: 360, p: 60 },
                { m: 'Feb', t: 480, d: 410, p: 70 },
                { m: 'Mar', t: 510, d: 430, p: 80 },
                { m: 'Apr', t: 580, d: 500, p: 80 },
                { m: 'May', t: 540, d: 460, p: 80 },
                { m: 'Jun', t: 620, d: 530, p: 90 },
                { m: 'Jul', t: 680, d: 580, p: 100 },
                { m: 'Aug', t: 740, d: 630, p: 110 },
                { m: 'Sep', t: 810, d: 710, p: 100 },
                { m: 'Oct', t: 520, d: 430, p: 90 }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-[#233D19] text-white text-[10px] p-2 rounded-xl pointer-events-none z-20 whitespace-nowrap shadow-lg">
                    <div>Total: {item.t}</div>
                    <div>Delivered: {item.d}</div>
                    <div>Pending: {item.p}</div>
                  </div>

                  {/* Bars Group */}
                  <div className="w-full flex items-end justify-center gap-0.5 h-44">
                    <div
                      className="w-2.5 bg-[#233D19] rounded-t-sm transition-all duration-300 hover:opacity-85"
                      style={{ height: `${(item.t / 850) * 100}%` }}
                    />
                    <div
                      className="w-2.5 bg-[#8EA57B] rounded-t-sm transition-all duration-300 hover:opacity-85"
                      style={{ height: `${(item.d / 850) * 100}%` }}
                    />
                    <div
                      className="w-2.5 bg-[#F5A623] rounded-t-sm transition-all duration-300 hover:opacity-85"
                      style={{ height: `${(item.p / 850) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#698453]">{item.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Delivery Performance (Donut Chart - 3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Delivery Performance
              </h3>
            </div>

            {/* Circular Ring Donut Chart SVG */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F0F5EC" strokeWidth="14" />
                
                {/* Delivered Segment */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.delPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.delPct / 100)}`}
                  strokeLinecap="round"
                />

                {/* Pending Segment */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.pendPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.pendPct / 100)}`}
                  strokeDashoffset={`${-2 * Math.PI * 48 * (metrics.delPct / 100)}`}
                />

                {/* Failed Segment */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#C62828"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.failPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.failPct / 100)}`}
                  strokeDashoffset={`${-2 * Math.PI * 48 * ((parseFloat(metrics.delPct) + parseFloat(metrics.pendPct)) / 100)}`}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#233D19]">
                  {metrics.delPct}%
                </span>
                <span className="text-[10px] text-[#698453] font-semibold uppercase tracking-wider">
                  Success Rate
                </span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 border-t border-[#EEF4E8] pt-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                  <span className="font-medium text-[#233D19]">Delivered</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.deliveredCount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.delPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                  <span className="font-medium text-[#233D19]">Pending</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.pendingCount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.pendPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
                  <span className="font-medium text-[#233D19]">Failed</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.failedCount}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.failPct}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Chart 3: Shipment Trends (Area Line Chart - 4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Shipment Trends
              </h3>
              <select
                value={trendFilter}
                onChange={(e) => {
                  setTrendFilter(e.target.value);
                  toast.info(`Trends view set to ${e.target.value}`);
                }}
                className="text-xs font-bold bg-[#F4F8EF] border border-[#DCE6D2] rounded-xl px-2.5 py-1 text-[#233D19] cursor-pointer focus:outline-none"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            {/* SVG Area Line Chart */}
            <div className="h-52 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 140" preserveAspectRatio="none">
                <path
                  d="M0 100 Q 40 80, 80 50 T 160 70 T 240 30 T 300 10 L 300 140 L 0 140 Z"
                  fill="url(#trendGradient)"
                  opacity="0.35"
                />
                <path
                  d="M0 100 Q 40 80, 80 50 T 160 70 T 240 30 T 300 10"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="100" r="4" fill="#2E7D32" />
                <circle cx="50" cy="80" r="4" fill="#2E7D32" />
                <circle cx="100" cy="50" r="4" fill="#2E7D32" />
                <circle cx="150" cy="70" r="4" fill="#2E7D32" />
                <circle cx="200" cy="40" r="4" fill="#2E7D32" />
                <circle cx="250" cy="30" r="4" fill="#2E7D32" />
                <circle cx="300" cy="10" r="4" fill="#2E7D32" />

                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-[#698453] pt-2 border-t border-[#EEF4E8]">
              <span>Sep 24</span>
              <span>Sep 25</span>
              <span>Sep 26</span>
              <span>Sep 27</span>
              <span>Sep 28</span>
              <span>Sep 29</span>
              <span>Sep 30</span>
            </div>
          </div>

        </div>

        {/* Middle Row Section 2 (3 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Top Customers (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Top Customers
              </h3>
              <Link
                to="/customers"
                className="text-xs font-bold text-[#587640] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {topCustomersList.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F9FCF7] border border-[#EEF4E8] hover:border-[#DCE6D2] transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#698453] text-[11px] w-4">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-[#EAF3D8] text-[#233D19] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {item.initials}
                    </div>
                    <div>
                      <span className="font-bold text-[#233D19] block">{item.name}</span>
                      <span className="text-[10px] text-[#698453]">{item.total} Shipments</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-[#698453]">{item.delivered} Del.</span>
                    <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-extrabold text-[10px] rounded-full">
                      {item.rate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Shipment Status Distribution (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Shipment Status Distribution
              </h3>
            </div>

            {/* Multi-segment Donut Chart */}
            <div className="flex flex-col items-center justify-center relative py-2">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F0F5EC" strokeWidth="14" />
                
                {/* Delivered (Green) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.delPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.delPct / 100)}`}
                />

                {/* In Transit (Blue) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#0066CC"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.transPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.transPct / 100)}`}
                  strokeDashoffset={`${-2 * Math.PI * 48 * (metrics.delPct / 100)}`}
                />

                {/* Pending (Yellow) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.pendPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.pendPct / 100)}`}
                  strokeDashoffset={`${-2 * Math.PI * 48 * ((parseFloat(metrics.delPct) + parseFloat(metrics.transPct)) / 100)}`}
                />

                {/* Failed (Red) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#C62828"
                  strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 48 * (metrics.failPct / 100)} ${2 * Math.PI * 48 * (1 - metrics.failPct / 100)}`}
                  strokeDashoffset={`${-2 * Math.PI * 48 * ((parseFloat(metrics.delPct) + parseFloat(metrics.transPct) + parseFloat(metrics.pendPct)) / 100)}`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#233D19]">
                  {metrics.totalShipments.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#698453] font-semibold uppercase tracking-wider">
                  Total Shipments
                </span>
              </div>
            </div>

            {/* Distribution Legend List */}
            <div className="space-y-2 border-t border-[#EEF4E8] pt-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                  <span className="font-medium text-[#233D19]">Delivered</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.deliveredCount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.delPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0066CC]" />
                  <span className="font-medium text-[#233D19]">In Transit</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.inTransitCount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.transPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                  <span className="font-medium text-[#233D19]">Pending</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.pendingCount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.pendPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
                  <span className="font-medium text-[#233D19]">Failed</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-[#233D19]">
                  <span>{metrics.failedCount}</span>
                  <span className="text-[11px] text-[#698453]">{metrics.failPct}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 3: Monthly Revenue & Shipments (Dual Axis Chart - 4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Monthly Revenue & Shipments
              </h3>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8EA57B]" />
                  Revenue
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#233D19]" />
                  Shipments
                </span>
              </div>
            </div>

            {/* SVG Dual Axis Combo Chart */}
            <div className="h-56 w-full pt-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160" preserveAspectRatio="none">
                {/* Revenue Bars */}
                {[
                  { x: 10, h: 60 },
                  { x: 42, h: 75 },
                  { x: 74, h: 90 },
                  { x: 106, h: 100 },
                  { x: 138, h: 95 },
                  { x: 170, h: 115 },
                  { x: 202, h: 125 },
                  { x: 234, h: 140 },
                  { x: 266, h: 150 }
                ].map((bar, i) => (
                  <rect
                    key={i}
                    x={bar.x}
                    y={150 - bar.h}
                    width="14"
                    height={bar.h}
                    rx="2"
                    fill="#8EA57B"
                    className="hover:opacity-80 transition"
                  />
                ))}

                {/* Shipment Line */}
                <path
                  d="M17 100 L 49 85 L 81 70 L 113 60 L 145 68 L 177 50 L 209 42 L 241 32 L 273 20"
                  fill="none"
                  stroke="#233D19"
                  strokeWidth="2.5"
                />

                {[
                  { x: 17, y: 100 },
                  { x: 49, y: 85 },
                  { x: 81, y: 70 },
                  { x: 113, y: 60 },
                  { x: 145, y: 68 },
                  { x: 177, y: 50 },
                  { x: 209, y: 42 },
                  { x: 241, y: 32 },
                  { x: 273, y: 20 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#233D19" />
                ))}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-[#698453] pt-2 border-t border-[#EEF4E8]">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Recent Shipment Details Table (Interactive Filters & Search) */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF4E8] pb-4">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                Recent Shipment Details
              </h3>
              <p className="text-xs text-[#698453]">Real-time live shipments tracked across logistics operations</p>
            </div>

            {/* Table Search & Status Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="flex items-center border border-[#DCE6D2] rounded-xl px-3 py-1.5 bg-[#F9FCF7] focus-within:border-[#587640] transition">
                <Search className="w-3.5 h-3.5 text-[#587640] mr-2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search tracking, sender..."
                  className="bg-transparent text-xs font-bold text-[#233D19] focus:outline-none placeholder:text-[#93A782] w-36 sm:w-44"
                />
              </div>

              {/* Status Filter */}
              <select
                value={tableStatusFilter}
                onChange={(e) => setTableStatusFilter(e.target.value)}
                className="text-xs font-bold bg-[#F4F8EF] border border-[#DCE6D2] rounded-xl px-3 py-1.5 text-[#233D19] cursor-pointer focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Picked Up">Picked Up</option>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Inter']">
              <thead>
                <tr className="border-b border-[#EEF4E8] text-[#7A9560] uppercase text-[10px] font-extrabold tracking-wider bg-[#F9FCF7]">
                  <th className="py-3 px-4 rounded-l-xl">Tracking Number</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Receiver</th>
                  <th className="py-3 px-4">Type & Weight</th>
                  <th className="py-3 px-4">Shipping Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF4E8]">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-xs text-[#93A782] font-semibold">
                      No matching shipments found. Try clearing filters.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-[#F4F8EF] transition">
                      <td className="py-3.5 px-4 font-bold text-[#233D19]">
                        <Link
                          to={`/tracking?trackingNo=${item.trackingNo}`}
                          className="flex items-center gap-2 font-mono text-[#233D19] hover:text-[#587640] hover:underline font-extrabold"
                        >
                          <Package className="w-4 h-4 text-[#587640]" />
                          <span>{item.trackingNo}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#233D19] block">{item.sender}</span>
                        <span className="text-[10px] text-[#698453]">{item.senderEmail || item.senderPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#233D19] block">{item.receiver}</span>
                        <span className="text-[10px] text-[#698453]">{item.receiverEmail || item.receiverPhone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#233D19] font-medium">
                        <span className="font-bold">{item.type}</span> • {item.weight}
                      </td>
                      <td className="py-3.5 px-4 text-[#233D19] font-medium">{item.shippingDate}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full border ${
                            item.status === 'In Transit'
                              ? 'bg-[#E3F2FD] text-[#0066CC] border-[#B3E5FC]'
                              : item.status === 'Picked Up' || item.status === 'Delivered'
                              ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                              : item.status === 'Out for Delivery'
                              ? 'bg-[#FFF3E0] text-[#E65100] border-[#FFE082]'
                              : item.status === 'Pending'
                              ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                              : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/tracking?trackingNo=${item.trackingNo}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#EAF3D8] border border-[#DCE6D2] text-[#233D19] rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                        >
                          <span>Track</span>
                          <ArrowRight className="w-3 h-3 text-[#385429]" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
