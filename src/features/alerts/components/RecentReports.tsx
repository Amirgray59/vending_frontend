import React from "react";
import { Bell, Check } from "lucide-react";

// مدل داده‌ها منطبق بر مقادیر دقیق داخل تصویر
const reportItems = [
 
  {
    id: 2,
    title: "بله",
    sentCount: "۳۵",
    successCount: "۲۹",
    successPercent: "۸۳٪",
    failedCount: "۶",
    failedPercent: "۱۷٪",
    time: "امروز، ۱۰:۳۰",
    iconType: "bale",
  },
  
];

export default function RecentReports() {
  return (
    <div className="w-full  bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      {/* هدر بخش گزارش‌ها */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-800">گزارش‌های اخیر</h3>
        <button className="text-xs font-bold text-[#1e57db] cursor-pointer">
          مشاهده همه
        </button>
      </div>

      {/* لیست کارت‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
        {reportItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
          >
            {/* بخش بالایی کارت: آیکون و عنوان */}
            <div className="flex items-center gap-2 mb-4">
              {item.iconType === "sms" && (
                <div className="w-9 h-9 rounded-full bg-[#4caf50] flex items-center justify-center text-white text-[10px] font-bold tracking-tighter">
                  SMS
                </div>
                // <img src="/message-icon/sms.png" alt="" className="h-16 w-16"/>
              )}
              {item.iconType === "bale" && (
                <div className="w-9 h-9 rounded-full bg-[#0fb374] flex items-center justify-center text-white">
                  <Check className="w-5 h-5 font-extrabold" />
                </div>
              )}
              {item.iconType === "app" && (
                <div className="w-9 h-9 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[#1e57db]">
                  <Bell className="w-5 h-5 fill-[#1e57db]" />
                </div>
              )}
              <span className="text-sm font-bold text-slate-800">
                {item.title}
              </span>
            </div>

            {/* بخش میانی کارت: جدول اطلاعات ارسالی */}
            <div className="grid grid-cols-3 text-center border-b border-slate-100 pb-3 mb-3">
              <div>
                <p className="text-xs text-gray-800 font-bold mb-1">
                  ارسال‌شده
                </p>
                <p className="text-xs font-semibold text-gray-800">
                  {item.sentCount}
                </p>
              </div>
              <div className="border-x border-slate-100">
                <p className="text-xs text-gray-800 font-bold mb-1">
                  تحویل موفق
                </p>
                <p className="text-xs font-semibold text-gray-800">
                  {item.successCount}{" "}
                  <span className="text-xs text-gray-800 font-bold">
                    ({item.successPercent})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-800 font-bold mb-1">ناموفق</p>

                <p className="text-xs font-semibold text-slate-800">
                  {item.failedCount} <span>({item.failedPercent})</span>
                </p>
              </div>
            </div>

            {/* بخش پایینی کارت: زمان و لینک جزئیات */}
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>
                آخرین ارسال:{" "}
                <span className="text-slate-500 font-medium">{item.time}</span>
              </span>
              <button className="text-[#1e57db] font-bold  cursor-pointer">
                مشاهده جزئیات
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
