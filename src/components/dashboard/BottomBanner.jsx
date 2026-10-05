import React from 'react';
import { ArrowRight, Truck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BottomBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#EBF3E3] border border-[#D5E3C4] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 font-['Inter'] w-full">
      
      {/* Left Text Info */}
      <div className="max-w-xl z-10 text-left">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#203912] tracking-tight leading-tight">
          Smarter Logistics<br />
          <span className="text-[#43642F]">for a Connected World</span>
        </h2>
        
        <p className="text-xs sm:text-sm text-[#506E3B] mt-2 font-medium leading-relaxed">
          Track your parcels in real-time, manage your shipments, and deliver happiness.
        </p>

        <button
          type="button"
          onClick={() => navigate('/shipments')}
          className="mt-5 px-6 py-3 bg-[#385429] hover:bg-[#203912] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>Create New Shipment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right Delivery Truck Graphic / Illustration */}
      <div className="relative z-10 flex items-center justify-center min-w-[240px] flex-shrink-0">
        <div className="w-56 h-36 bg-gradient-to-tr from-[#D4E5C0] to-[#E2F0D2] rounded-3xl border border-[#C5DAB0] flex items-center justify-center p-4 relative shadow-inner overflow-hidden">
          {/* Background Trees Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#486634_1px,transparent_1px)] [background-size:12px_12px]"></div>

          {/* Delivery Truck Graphic SVG */}
          <div className="relative flex items-center justify-center gap-2 z-10">
            <div className="w-20 h-20 bg-[#385429] rounded-2xl flex items-center justify-center text-white shadow-lg transform -rotate-3">
              <Truck className="w-10 h-10 text-white" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#587640] shadow-md border border-[#D3E3BE] transform rotate-6">
                <Package className="w-6 h-6" />
              </div>
              <div className="w-9 h-9 bg-[#C2DAA5] rounded-lg flex items-center justify-center text-[#203912] shadow-xs">
                <Package className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BottomBanner;
