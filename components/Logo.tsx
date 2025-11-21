import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", light = false }) => {
  const color = light ? "#ffffff" : "#10b981"; // White or Emerald
  
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Staff */}
      <path d="M50 10V90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      
      {/* Wings */}
      <path d="M50 25 C30 10, 10 30, 15 40 C20 35, 40 30, 50 35" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 25 C70 10, 90 30, 85 40 C80 35, 60 30, 50 35" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Snakes - Simplified intertwining */}
      <path d="M50 90 C30 80, 30 60, 50 55 C70 50, 70 30, 50 25" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M50 90 C70 80, 70 60, 50 55 C30 50, 30 30, 50 25" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
      
      {/* Top Knob */}
      <circle cx="50" cy="10" r="5" fill={color} />
    </svg>
  );
};

export default Logo;