import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F4F7EF] flex font-['Inter'] text-[#233D19]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
