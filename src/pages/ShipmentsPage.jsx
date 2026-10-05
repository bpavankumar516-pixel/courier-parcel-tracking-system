import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Truck, Plus, Search, Filter } from 'lucide-react';

const ShipmentsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
              Shipments Management
            </h1>
            <p className="text-xs sm:text-sm text-[#5C7847] mt-1 font-medium">
              Create, view, filter, and track all parcel shipments.
            </p>
          </div>

          <button className="px-5 py-2.5 bg-[#385429] hover:bg-[#203912] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>Create New Shipment</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A9560]" />
            <input
              type="text"
              placeholder="Search by tracking no, sender..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAFCF7] border border-[#D7E5BE] rounded-xl text-xs text-[#233D19] focus:outline-none focus:border-[#587640]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F4F7EF] border border-[#D7E5BE] rounded-xl text-xs font-semibold text-[#385429]">
              <Filter className="w-3.5 h-3.5" /> Filter Status
            </button>
          </div>
        </div>

        {/* Content Shell */}
        <div className="bg-white rounded-3xl p-8 border border-[#DCE6D2] text-center py-16 shadow-xs">
          <Truck className="w-12 h-12 text-[#587640] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-[#233D19]">Shipments Module</h3>
          <p className="text-xs text-[#698453] max-w-md mx-auto mt-1">
            Full shipment CRUD, automated tracking number generation, status filtering, and parcel creation will be ready in Module 3.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShipmentsPage;
