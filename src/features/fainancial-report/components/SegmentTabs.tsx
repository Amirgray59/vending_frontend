"use client";
import React, { useState } from "react";

const SegmentedTabs = () => {
  // تب‌های موجود در تصویر به ترتیب از راست به چپ
  const tabs = ["مالی", "عملیاتی", "موجودی", "موقعیت"];
  const [activeTab, setActiveTab] = useState("مالی");

  return (
    <div className="flex justify-center border-b pb-3 border-gray-100 md:justify-start ">
      {/* کانتینر اصلی با لبه‌های گرد و حاشیه نازک */}
      <div className="flex items-center bg-white border border-[#E2E8F0] rounded-sm overflow-hidden shadow-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative px-4 sm:px-8 py-2.5 cursor-pointer text-sm font-bold transition-all duration-200
              /* استایل وضعیت فعال (آبی) و غیرفعال (طوسی) */
              ${
                activeTab === tab
                  ? "bg-[#2563EB] text-white shadow-md z-10"
                  : "bg-white text-[#64748B] hover:bg-gray-50"
              }
              /* ایجاد خط جداکننده بین دکمه‌ها (به جز آخرین آیتم سمت چپ) */
              ${index !== tabs.length - 1 ? "border-l border-[#E2E8F0]" : ""}
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedTabs;
