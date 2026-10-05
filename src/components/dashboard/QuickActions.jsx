import React from 'react';
import { Package, UserPlus, MapPin, BarChart2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create New Shipment',
      description: 'Add and ship a new parcel',
      icon: Package,
      path: '/shipments'
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: UserPlus,
      path: '/customers'
    },
    {
      title: 'Track Parcel',
      description: 'Search by tracking number',
      icon: MapPin,
      path: '/tracking'
    },
    {
      title: 'View Reports',
      description: 'Check detailed analytics',
      icon: BarChart2,
      path: '/reports'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
      
      {/* Header */}
      <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19] mb-4">
        Quick Actions
      </h3>

      {/* Grid of Action Cards */}
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="w-full p-3.5 bg-[#FAFCF8] hover:bg-[#F2F7EC] border border-[#E3EDDA] hover:border-[#C6DAAF] rounded-2xl flex items-center justify-between transition-all duration-200 group text-left shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF3D8] text-[#587640] group-hover:bg-[#587640] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#233D19] group-hover:text-[#587640] transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-[#7A9567] font-medium">
                    {action.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#8EA57B] group-hover:text-[#233D19] group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default QuickActions;
