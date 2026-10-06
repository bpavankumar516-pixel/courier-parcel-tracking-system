import React, { useMemo } from 'react';
import { Package, CheckCircle2, Truck, UserPlus, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShipments } from '../../context/ShipmentContext';
import { useCustomers } from '../../context/CustomerContext';

const RecentActivities = () => {
  const { shipments = [] } = useShipments();
  const { customers = [] } = useCustomers();

  // Dynamically generate real-time activities from live Contexts
  const activities = useMemo(() => {
    const list = [];

    // Add recent shipments activities
    shipments.slice(0, 4).forEach((s, idx) => {
      let icon = Package;
      let iconBg = 'bg-[#EAF3D8] text-[#587640]';
      let title = `Shipment ${s.status}`;

      if (s.status === 'Delivered') {
        icon = CheckCircle2;
        iconBg = 'bg-[#E8F5E9] text-[#2E7D32]';
      } else if (s.status === 'In Transit' || s.status === 'Out for Delivery') {
        icon = Truck;
        iconBg = 'bg-[#E3F2FD] text-[#0066CC]';
      } else if (s.status === 'Cancelled' || s.status === 'Failed Delivery') {
        icon = XCircle;
        iconBg = 'bg-[#FFEBEE] text-[#C62828]';
      }

      list.push({
        id: `ship-${s.id || idx}`,
        title: title,
        subtitle: `${s.trackingNo} - ${s.sender} to ${s.receiver}`,
        time: s.shippingDate || 'Recent',
        icon,
        iconBg
      });
    });

    // Add recent customer registration activity from live API users
    if (customers.length > 0) {
      const topCustomer = customers[0];
      list.push({
        id: `cust-${topCustomer.id}`,
        title: 'New customer account synced',
        subtitle: `${topCustomer.name} (${topCustomer.city})`,
        time: topCustomer.joinedDate || 'Today',
        icon: UserPlus,
        iconBg: 'bg-[#F3E5F5] text-[#8E24AA]'
      });
    }

    return list.slice(0, 5);
  }, [shipments, customers]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19]">
            Recent Activities
          </h3>
          <p className="text-[11px] text-[#698453]">Real-time system events feed</p>
        </div>
        <Link
          to="/notifications"
          className="text-xs font-semibold text-[#587640] hover:text-[#233D19] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Activity Items List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-xs text-center text-[#7A9560] py-4">No recent activity logs.</p>
        ) : (
          activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#233D19] group-hover:text-[#587640] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#789564] font-medium truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-[#93A782] font-medium flex-shrink-0">
                  {item.time}
                </span>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default RecentActivities;
