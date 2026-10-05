import React from 'react';
import { Package, CheckCircle2, Truck, UserPlus, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      title: 'New shipment created',
      subtitle: 'TRK1234567890 - John Doe',
      time: '10:24 AM',
      icon: Package,
      iconBg: 'bg-[#EAF3D8] text-[#587640]'
    },
    {
      id: 2,
      title: 'Parcel delivered',
      subtitle: 'TRK0987654321 - Sarah Wilson',
      time: '09:42 AM',
      icon: CheckCircle2,
      iconBg: 'bg-[#E8F5E9] text-[#2E7D32]'
    },
    {
      id: 3,
      title: 'Status updated to In Transit',
      subtitle: 'TRK5678901234 - Mike Johnson',
      time: '08:15 AM',
      icon: Truck,
      iconBg: 'bg-[#E3F2FD] text-[#0066CC]'
    },
    {
      id: 4,
      title: 'New customer registered',
      subtitle: 'Acme Corp',
      time: 'Yesterday',
      icon: UserPlus,
      iconBg: 'bg-[#F3E5F5] text-[#8E24AA]'
    },
    {
      id: 5,
      title: 'Shipment cancelled',
      subtitle: 'TRK1122334455 - David Brown',
      time: 'Yesterday',
      icon: XCircle,
      iconBg: 'bg-[#FFEBEE] text-[#C62828]'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19]">
          Recent Activities
        </h3>
        <Link
          to="/notifications"
          className="text-xs font-semibold text-[#587640] hover:text-[#233D19] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Activity Items List */}
      <div className="space-y-4">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#233D19] group-hover:text-[#587640] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#789564] font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-[#93A782] font-medium flex-shrink-0">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RecentActivities;
