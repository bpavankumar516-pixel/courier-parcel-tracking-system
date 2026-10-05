import React from 'react';
import { ShieldCheck } from 'lucide-react';

const OnTimeGaugeCard = ({ percentage = 96.8 }) => {
  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4 h-full relative overflow-hidden">
      
      {/* Circular SVG Progress Gauge */}
      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#E3EED5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#385429"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs text-[#233D19]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Info Badge & Text */}
      <div className="flex-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF3D8] text-[#385429] rounded-full text-xs font-bold mb-1.5 border border-[#D5E3C0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#385429]" />
          <span>On-Time Delivery</span>
        </div>
        <p className="text-xs font-semibold text-[#5B7945] leading-snug">
          Excellent performance!
        </p>
      </div>

    </div>
  );
};

export default OnTimeGaugeCard;
