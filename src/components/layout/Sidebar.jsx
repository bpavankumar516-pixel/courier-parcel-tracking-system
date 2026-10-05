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
    <aside className="w-64 bg-[#EAF1E2] border-r border-[#D3E0C6] flex flex-col justify-between h-screen sticky top-0 z-30 select-none flex-shrink-0 font-['Inter']">
      
      {/* Top Header & Brand Logo */}
      <div>
        <div className="p-6 border-b border-[#D8E4CB]/60">
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
                    ? 'bg-[#C5D9B0] text-[#1E3713] font-bold shadow-2xs'
                    : 'text-[#4A6437] hover:bg-[#DDEBCE] hover:text-[#233D19]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E3713]' : 'text-[#587640]'}`} />
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

          <div className="pt-4 mt-2 border-t border-[#D3E0C6]/70">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C5D9B0] text-[#1E3713] font-bold shadow-2xs'
                    : 'text-[#4A6437] hover:bg-[#DDEBCE] hover:text-[#233D19]'
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
      <div className="p-4 m-4 bg-[#DCE8CF] rounded-3xl border border-[#C5D7B3] relative overflow-hidden shadow-2xs">
        <div className="flex items-center justify-center mb-2">
          {/* Leaves & Box Illustration */}
          <div className="w-14 h-14 bg-white/60 backdrop-blur-xs rounded-2xl flex items-center justify-center border border-[#B8CC9F]/50 shadow-2xs">
            <Package className="w-7 h-7 text-[#466731]" />
          </div>
        </div>
        <p className="text-center font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#203912] leading-snug">
          Faster Deliveries<br />
          <span className="font-semibold text-[#486634]">Happier Customers</span>
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
