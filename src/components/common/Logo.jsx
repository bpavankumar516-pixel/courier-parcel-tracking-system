import React from 'react';

const Logo = ({ size = 'medium', lightMode = false }) => {
  const iconSizes = {
    small: 'w-7 h-7',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Custom Deliverly Box Icon with Speed Lines matching exact reference image */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} text-[#1E3914]`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Isometric Parcel */}
          <path
            d="M20 6L34 13V29L20 36L6 29V13L20 6Z"
            fill={lightMode ? '#FFFFFF' : '#1E3914'}
            stroke={lightMode ? '#FFFFFF' : '#1E3914'}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M20 6V20M20 20L34 13M20 20L6 13"
            stroke={lightMode ? '#5D7C3F' : '#E6F0C8'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tape Detail */}
          <path
            d="M13 23.5L20 27L27 23.5"
            stroke={lightMode ? '#5D7C3F' : '#E6F0C8'}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Speed Motion Lines on Left */}
          <path
            d="M2 15H6M1 21H5M3 27H7"
            stroke={lightMode ? '#E6F0C8' : '#5D7C3F'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className={`font-extrabold tracking-tight ${textSizes[size]} ${lightMode ? 'text-white' : 'text-[#1E3914]'} font-['Plus_Jakarta_Sans'] flex items-center`}>
        Deliverly
      </div>
    </div>
  );
};

export default Logo;
