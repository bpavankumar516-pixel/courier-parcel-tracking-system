import React from 'react';

const MetricCard = ({
  title,
  value,
  changeText,
  isPositive = true,
  icon: Icon,
  badgeBg = 'bg-[#EAF3D8]',
  badgeColor = 'text-[#587640]',
  sparklineColor = '#587640',
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Top Row: Icon & Sparkline */}
      <div className="flex items-start justify-between mb-2">
        <div className={`w-11 h-11 ${badgeBg} ${badgeColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-24 h-10">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,30 Q 25,10 50,22 T 100,8 L 100,40 L 0,40 Z"
              fill={`url(#grad-${title.replace(/[^a-zA-Z0-9]/g, '')})`}
            />
            <path
              d="M 0,30 Q 25,10 50,22 T 100,8"
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Metric Content */}
      <div>
        <p className="text-xs font-semibold text-[#668050] mb-1">{title}</p>
        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
          {value}
        </h3>
      </div>

      {/* Bottom Subtext */}
      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold">
        <span className={isPositive ? 'text-[#3E7324]' : 'text-red-600'}>
          {changeText}
        </span>
      </div>

    </div>
  );
};

export default MetricCard;
