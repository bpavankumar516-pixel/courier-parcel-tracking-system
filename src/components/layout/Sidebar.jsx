import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  ShieldCheck,
  Bell,
  BarChart2,
  Settings,
  Package
} from 'lucide-react';
import Logo from '../common/Logo';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Shipments', path: '/shipments', icon: Truck },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Parcel Tracking', path: '/tracking', icon: MapPin },
    { name: 'Delivery Status', path: '/status', icon: ShieldCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: '3' },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-[#F0F5EC] border-r border-[#DCE6D2] flex flex-col justify-between h-screen sticky top-0 z-30 select-none flex-shrink-0 font-['Inter']">
      
      {/* Top Header & Brand Logo */}
      <div>
        <div className="p-6 border-b border-[#DCE6D2]">
          <Logo size="medium" />
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#DCE8CE] text-[#233D19] font-bold shadow-2xs border border-[#C6D8B0]'
                    : 'text-[#4F683E] hover:bg-[#E4ECCF] hover:text-[#233D19]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#233D19]' : 'text-[#587640]'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E53935] text-white rounded-full shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-2 border-t border-[#DCE6D2]">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#DCE8CE] text-[#233D19] font-bold shadow-2xs border border-[#C6D8B0]'
                    : 'text-[#4F683E] hover:bg-[#E4ECCF] hover:text-[#233D19]'
                }`
              }
            >
              <Settings className="w-4 h-4 text-[#587640]" />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Bottom Promo / Quote Illustration Card */}
      <div className="p-4 m-4 bg-white/90 backdrop-blur-xs rounded-3xl border border-[#DCE6D2] relative overflow-hidden shadow-2xs">
        <div className="flex items-center justify-center mb-2">
          {/* Leaves & Box Illustration */}
          <div className="w-14 h-14 bg-[#F0F5EC] rounded-2xl flex items-center justify-center border border-[#DCE6D2] shadow-2xs">
            <Package className="w-7 h-7 text-[#385429]" />
          </div>
        </div>
        <p className="text-center font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#233D19] leading-snug">
          Faster Deliveries<br />
          <span className="font-semibold text-[#587640]">Happier Customers</span>
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
