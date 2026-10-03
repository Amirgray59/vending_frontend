import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-t-[#F6711A]' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-6 h-6 border-4',
  };

  return (
    <div className={`
      w-6 h-6  border-4
      ${color} 
      border-gray-200 
      rounded-full 
      animate-spin
    `}></div>
  );
};

export default Spinner;
