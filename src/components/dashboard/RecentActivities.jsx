import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, Truck, UserPlus, XCircle, RefreshCw, UserCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActivitiesFromStorage } from '../../services/activityLogger';

const RecentActivities = () => {
  const [activities, setActivities] = useState(() => getActivitiesFromStorage());

  useEffect(() => {
    // Initial fetch from LocalStorage
    setActivities(getActivitiesFromStorage());

    // Real-time listener for activity log dispatches
    const handleActivityLog = (e) => {
      if (e.detail) {
        setActivities(e.detail);
      } else {
        setActivities(getActivitiesFromStorage());
      }
    };

    window.addEventListener('deliverly_activity_log', handleActivityLog);
    return () => {
      window.removeEventListener('deliverly_activity_log', handleActivityLog);
    };
  }, []);

  const getIconAndStyle = (type) => {
    switch (type) {
      case 'shipment_create':
        return { icon: Package, iconBg: 'bg-[#EAF3D8] text-[#587640]' };
      case 'shipment_deliver':
        return { icon: CheckCircle2, iconBg: 'bg-[#E8F5E9] text-[#2E7D32]' };
      case 'shipment_update':
        return { icon: Truck, iconBg: 'bg-[#E3F2FD] text-[#0066CC]' };
      case 'shipment_delete':
        return { icon: XCircle, iconBg: 'bg-[#FFEBEE] text-[#C62828]' };
      case 'customer_add':
        return { icon: UserPlus, iconBg: 'bg-[#F3E5F5] text-[#8E24AA]' };
      case 'customer_update':
        return { icon: UserCheck, iconBg: 'bg-[#FFF3E0] text-[#E65100]' };
      case 'customer_delete':
        return { icon: XCircle, iconBg: 'bg-[#FFEBEE] text-[#C62828]' };
      case 'customer_sync':
        return { icon: RefreshCw, iconBg: 'bg-[#E0F2FE] text-[#0284C7]' };
      default:
        return { icon: Clock, iconBg: 'bg-gray-100 text-gray-600' };
    }
  };

  const displayActivities = activities.slice(0, 5);

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
        {displayActivities.length === 0 ? (
          <p className="text-xs text-center text-[#7A9560] py-4">No recent activity logs.</p>
        ) : (
          displayActivities.map((item) => {
            const { icon: Icon, iconBg } = getIconAndStyle(item.type);
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
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
