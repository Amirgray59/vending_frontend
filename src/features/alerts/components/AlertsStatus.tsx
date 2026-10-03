
"use client";
import React from "react";
import { CheckCircle, Bell, AlertTriangle, Clock } from "lucide-react";
import { RiWifiOffLine } from "react-icons/ri";
import useGetAlertStats from "../hooks/useGetAlertStats";

// تعریف ساختار کارت‌ها برای نگاشت با دیتای بک‌اند
const STATS_CONFIG = [
  {
    key: "total", // کل هشدارها
    title: "کل هشدارها",
    description: "تعداد کل",
    icon: <CheckCircle className="w-5 h-5 text-[#4E886C]" />,
    iconBg: "bg-[#E4F8EB]",
    changeColor: "text-green-500",
    defaultChange: "به‌روزرسانی شده",
  },
  {
    key: "open", // هشدارهای باز
    title: "هشدارهای باز",
    description: "در انتظار بررسی",
    icon: <Bell className="w-5 h-5 text-[#C68656]" />,
    iconBg: "bg-[#FCEDD9]",
    changeColor: "text-red-500",
    defaultChange: "نیاز به اقدام",
  },
  {
    key: "critical", // هشدارهای بحرانی
    title: "بحرانی",
    description: "شدت بالا",
    icon: <AlertTriangle className="w-5 h-5 text-[#C6484B]" />,
    iconBg: "bg-[#F9DAD8]",
    changeColor: "text-red-500",
    defaultChange: "بسیار مهم",
  },
  {
    key: "last_24h", // ۲۴ ساعت اخیر
    title: "۲۴ ساعت اخیر",
    description: "تعداد جدید",
    icon: <Clock className="w-5 h-5 text-[#A0A0AB]" />,
    iconBg: "bg-[#EDEEF1]",
    changeColor: "text-blue-500",
    defaultChange: "تغییرات اخیر",
  },
];

export default function AlertStats() {
  const { alertStats, isGettingAlertStats } = useGetAlertStats();

  // رندر Skeleton در صورت لودینگ
  if (isGettingAlertStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-40 animate-pulse">
            <div className="flex justify-between">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="w-12 h-3 bg-gray-200 rounded mt-2" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="w-16 h-6 bg-gray-300 rounded" />
              <div className="w-24 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((config, index) => {
          // استخراج مقدار واقعی از دیتای بک‌اند بر اساس کلید (Key)
          const value = alertStats?.[config.key] || 0;

          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between relative overflow-hidden h-40"
            >
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full ${config.iconBg} flex items-center justify-center`}>
                  {config.icon}
                </div>
              </div>

              <div className="h-full">
                <div className="flex h-full flex-col items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">
                    {config.title}

                  </span>
                  <span className="text-2xl font-bold text-slate-800 mb-1">
                    {value}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {config.description}
                  </span>

                 
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}