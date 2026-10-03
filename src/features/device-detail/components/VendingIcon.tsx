
import React from "react";

interface VendingIconProps {
  size?: number; 
  className?: string; 
}

const VendingIcon = ({ size = 48, className = "" }: VendingIconProps) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-blue-50/60 ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        width={size* 0.5} // کمی کوچک‌تر برای ایجاد فضای سفید (White Space) بیشتر
        height={size * 0.5} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-500" // رنگ کمی ملایم‌تر
      >
        {/* بدنه اصلی با گوشه‌های گردتر و خطوط نازک‌تر */}
        <rect 
          x="3" y="3" width="18" height="18" rx="3" 
          stroke="currentColor" strokeWidth="1.2" 
        />

        {/* خط جداکننده بخش دکمه‌ها - بسیار نازک */}
        <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        {/* دکمه‌های ریز (به جای دایره کامل، از نقاط کوچک استفاده شده) */}
        <circle cx="17" cy="6" r="0.7" fill="currentColor" />
        <circle cx="17" cy="9" r="0.7" fill="currentColor" />
        <circle cx="17" cy="12" r="0.7" fill="currentColor" />
        <circle cx="17" cy="15" r="0.7" fill="currentColor" />

        {/* کالاهای داخلی - به صورت مربع‌های خیلی ساده و ظریف */}
        <rect x="6" y="6" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="6" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="6" y="11" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="11" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />

        {/* بخش خروجی کالا - ساده شده و مینیمال */}
        <path 
          d="M6 17 H13 V20 H6 V17Z" 
          stroke="currentColor" strokeWidth="1.2" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default VendingIcon;