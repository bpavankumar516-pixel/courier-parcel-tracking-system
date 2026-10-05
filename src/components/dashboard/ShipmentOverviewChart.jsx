import React, { useState } from 'react';

const ShipmentOverviewChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Smooth bezier curve paths matching exact artwork in media_1791193255510.png
  // Canvas: width 600, height 220
  // Y-Scale: 80 = 20, 60 = 60, 40 = 100, 20 = 140, 0 = 180
  // X-Coordinates: Mon=50, Tue=133.3, Wed=216.6, Thu=300, Fri=383.3, Sat=466.6, Sun=550

  const deliveredPath = "M 50,130 C 90,80 100,80 133.3,90 C 170,100 180,60 216.6,60 C 250,60 270,90 300,90 C 340,90 350,56 383.3,56 C 420,56 435,44 466.6,44 C 500,44 520,64 550,64";
  const deliveredArea = `${deliveredPath} L 550,180 L 50,180 Z`;

  const inTransitPath = "M 50,150 C 90,130 100,120 133.3,120 C 170,120 180,95 216.6,95 C 250,95 270,125 300,125 C 340,125 350,90 383.3,90 C 420,90 435,80 466.6,80 C 500,80 520,110 550,110";
  const inTransitArea = `${inTransitPath} L 550,180 L 50,180 Z`;

  const pendingPath = "M 50,166 C 90,150 100,150 133.3,150 C 170,150 180,135 216.6,135 C 250,135 270,152 300,152 C 340,152 350,138 383.3,138 C 420,138 435,148 466.6,148 C 500,148 520,140 550,140";
  const pendingArea = `${pendingPath} L 550,180 L 50,180 Z`;

  // Coordinates for interactive hover dots
  const dotCoords = [
    { x: 50, del: 130, tra: 150, pen: 166 },
    { x: 133.3, del: 90, tra: 120, pen: 150 },
    { x: 216.6, del: 60, tra: 95, pen: 135 },
    { x: 300, del: 90, tra: 125, pen: 152 },
    { x: 383.3, del: 56, tra: 90, pen: 138 },
    { x: 466.6, del: 44, tra: 80, pen: 148 },
    { x: 550, del: 64, tra: 110, pen: 140 }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
      
      {/* Chart Header & Legend Alignment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19]">
            Shipment Overview
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#385429]"></span>
            <span className="text-[#385429]">Delivered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#689F7C]"></span>
            <span className="text-[#689F7C]">In Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E68A2E]"></span>
            <span className="text-[#E68A2E]">Pending</span>
          </div>
        </div>
      </div>

      {/* Responsive Smooth SVG Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <svg viewBox="0 0 600 220" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chartDeliveredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#385429" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#385429" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chartInTransitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#689F7C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#689F7C" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="chartPendingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E68A2E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#E68A2E" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines & Y-Axis Labels */}
            {[
              { val: 80, y: 20 },
              { val: 60, y: 60 },
              { val: 40, y: 100 },
              { val: 20, y: 140 },
              { val: 0, y: 180 }
            ].map((grid) => (
              <g key={grid.val}>
                <text x="20" y={grid.y + 4} className="text-[11px] fill-[#8AA378] font-medium">
                  {grid.val}
                </text>
                <line
                  x1="45"
                  y1={grid.y}
                  x2="565"
                  y2={grid.y}
                  stroke="#EFF4EA"
                  strokeWidth="1.5"
                />
              </g>
            ))}

            {/* Gradient Area Fills */}
            <path d={deliveredArea} fill="url(#chartDeliveredGrad)" />
            <path d={inTransitArea} fill="url(#chartInTransitGrad)" />
            <path d={pendingArea} fill="url(#chartPendingGrad)" />

            {/* Smooth Bezier Curves */}
            <path d={deliveredPath} fill="none" stroke="#385429" strokeWidth="2.5" strokeLinecap="round" />
            <path d={inTransitPath} fill="none" stroke="#689F7C" strokeWidth="2.5" strokeLinecap="round" />
            <path d={pendingPath} fill="none" stroke="#E68A2E" strokeWidth="2.5" strokeLinecap="round" />

            {/* Interactive Data Points */}
            {dotCoords.map((coord, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={days[idx]}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && (
                    <line x1={coord.x} y1="20" x2={coord.x} y2="180" stroke="#C5D9B0" strokeWidth="1.5" strokeDasharray="4 4" />
                  )}

                  <circle cx={coord.x} cy={coord.del} r={isHovered ? "6" : "4"} fill="#385429" stroke="#FFF" strokeWidth="2" />
                  <circle cx={coord.x} cy={coord.tra} r={isHovered ? "6" : "4"} fill="#689F7C" stroke="#FFF" strokeWidth="2" />
                  <circle cx={coord.x} cy={coord.pen} r={isHovered ? "6" : "4"} fill="#E68A2E" stroke="#FFF" strokeWidth="2" />

                  <text
                    x={coord.x}
                    y="205"
                    textAnchor="middle"
                    className={`text-[12px] font-medium transition-all ${
                      isHovered ? 'fill-[#233D19] font-bold' : 'fill-[#7C9769]'
                    }`}
                  >
                    {days[idx]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

    </div>
  );
};

export default ShipmentOverviewChart;
