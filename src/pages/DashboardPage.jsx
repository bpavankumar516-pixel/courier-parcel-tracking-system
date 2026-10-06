import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import OnTimeGaugeCard from '../components/dashboard/OnTimeGaugeCard';
import ShipmentOverviewChart from '../components/dashboard/ShipmentOverviewChart';
import RecentShipmentsTable from '../components/dashboard/RecentShipmentsTable';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';
import BottomBanner from '../components/dashboard/BottomBanner';
import { Package, Truck, CheckCircle2, Clock, Users, Calendar, Target, ChevronDown } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { shipments = [] } = useShipments();
  const { customers = [] } = useCustomers();
  const [dateFilter, setDateFilter] = useState('All Time');

  // Dynamic calculations based on live Shipment & Customer Context data
  const metrics = useMemo(() => {
    const totalShipments = shipments.length;
    const inTransitCount = shipments.filter((s) => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
    const deliveredCount = shipments.filter((s) => s.status === 'Delivered').length;
    const pendingCount = shipments.filter((s) => s.status === 'Pending' || s.status === 'Picked Up').length;

    const totalCustomers = customers.length;
    const activeShipmentsCount = inTransitCount + pendingCount;

    // Delivery success rate percentage
    const successRateVal = totalShipments > 0 ? Math.round((deliveredCount / totalShipments) * 1000) / 10 : 100;
    const successRateText = `${successRateVal}%`;
    const gaugePercent = totalShipments > 0 ? Math.round((deliveredCount / totalShipments) * 100) : 100;

    return {
      totalShipments,
      inTransitCount,
      deliveredCount,
      pendingCount,
      totalCustomers,
      activeShipmentsCount,
      successRateText,
      gaugePercent
    };
  }, [shipments, customers]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-6 font-['Inter']">
        
        {/* Top Header Title & Date Filter Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#5C7847] mt-1 font-medium">
              Welcome back, <span className="font-bold text-[#233D19]">{user?.name || 'Pavan Kumar'}</span>! Here's what's happening with your live deliveries and customer accounts.
            </p>
          </div>

          {/* Date Picker Filter */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#D5E2C9] text-xs font-semibold text-[#233D19] shadow-2xs cursor-pointer hover:bg-[#F4F7EF] transition">
              <Calendar className="w-3.5 h-3.5 text-[#587640]" />
              <span>{dateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#587640]" />
            </div>
            <span className="text-xs font-semibold text-[#668250]">
              Oct 06, 2026
            </span>
          </div>
        </div>

        {/* Row 1: 4 Key Metric Cards (Dynamic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Shipments"
            value={String(metrics.totalShipments)}
            changeText="↑ Live Reactive Count"
            isPositive={true}
            icon={Package}
            badgeBg="bg-[#EAF3D8]"
            badgeColor="text-[#587640]"
            sparklineColor="#587640"
          />

          <MetricCard
            title="In Transit Parcels"
            value={String(metrics.inTransitCount)}
            changeText="Active En Route"
            isPositive={true}
            icon={Truck}
            badgeBg="bg-[#E0F2F1]"
            badgeColor="text-[#00796B]"
            sparklineColor="#00796B"
          />

          <MetricCard
            title="Delivered Parcels"
            value={String(metrics.deliveredCount)}
            changeText="Completed Handover"
            isPositive={true}
            icon={CheckCircle2}
            badgeBg="bg-[#E8F5E9]"
            badgeColor="text-[#2E7D32]"
            sparklineColor="#2E7D32"
          />

          <MetricCard
            title="Pending Deliveries"
            value={String(metrics.pendingCount)}
            changeText="Awaiting Dispatch"
            isPositive={false}
            icon={Clock}
            badgeBg="bg-[#FFF3E0]"
            badgeColor="text-[#E65100]"
            sparklineColor="#E65100"
          />
        </div>

        {/* Row 2: 3 Metrics + On-Time Delivery Gauge (Dynamic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Customers"
            value={String(metrics.totalCustomers)}
            changeText="Live DummyJSON API"
            isPositive={true}
            icon={Users}
            badgeBg="bg-[#F3E5F5]"
            badgeColor="text-[#7B1FA2]"
            sparklineColor="#7B1FA2"
          />

          <MetricCard
            title="Active Operations"
            value={String(metrics.activeShipmentsCount)}
            changeText="In Transit & Pending"
            isPositive={true}
            icon={Calendar}
            badgeBg="bg-[#E4F6ED]"
            badgeColor="text-[#00897B]"
            sparklineColor="#00897B"
          />

          <MetricCard
            title="Delivery Success Rate"
            value={metrics.successRateText}
            changeText="Live Fulfilled Rate"
            isPositive={true}
            icon={Target}
            badgeBg="bg-[#EAF3D8]"
            badgeColor="text-[#385429]"
            sparklineColor="#385429"
          />

          <OnTimeGaugeCard percentage={metrics.gaugePercent} />
        </div>

        {/* Middle Section: Chart + Table (Left 8 Cols) & Activities + Actions (Right 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Chart + Recent Shipments Table */}
          <div className="lg:col-span-8 space-y-6">
            <ShipmentOverviewChart />
            <RecentShipmentsTable />
          </div>

          {/* Right Column (4 cols): Recent Activities + Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <RecentActivities />
            <QuickActions />
          </div>

        </div>

        {/* Bottom Full-Width Hero Banner */}
        <BottomBanner />

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
