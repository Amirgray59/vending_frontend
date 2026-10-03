
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";
import useGetDashboardInfo from "@/features/dashboard/hooks/useGetDashboardInfo";

interface DeviceStatus {
  name: string;
  value: number;
  color: string;
}

export default function DeviceStatusChart() {
  const [mounted, setMounted] = useState(false);
  const { dashboardInfo, isgettingDashboardInfo } = useGetDashboardInfo();


  useEffect(() => {
    setMounted(true);
  }, []);

  // استخراج و تبدیل دیتای دستگاه‌ها از مسیر kpis.devices
  const devicesData: DeviceStatus[] = React.useMemo(() => {
    const deviceKpis = dashboardInfo?.kpis?.devices;
    if (!deviceKpis) return [];

    return [
      { 
        name: "روشن", 
        value: deviceKpis.online || 0, 
        color: "#22c55e" 
      },
      { 
        name: "آفلاین", 
        value: deviceKpis.offline || 0, 
        color: "#cbd5e1" 
      },
      { 
        name: "در انتظار", 
        value: deviceKpis.pending || 0, 
        color: "#ef4444" 
      },
    ].filter(item => item.value > 0); // فقط نمایش مواردی که مقدار دارند
  }, [dashboardInfo]);

  // محاسبه کل دستگاه‌ها از دیتای بک‌اِند
  const totalDevices = dashboardInfo?.kpis?.devices?.total || 0;

  // نمایش Skeleton در زمان لودینگ یا قبل از مانت شدن
  if (!mounted || isgettingDashboardInfo) {
    return (
      <div className="w-full h-[350] rounded-lg border border-gray-100 bg-white p-6 shadow-sm animate-pulse flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between gap-4 my-2">
          <div className="w-[150] h-[150] bg-gray-100 rounded-full" />
          <div className="flex flex-col gap-4 w-1/3">
            <div className="h-6 bg-gray-100 rounded w-full" />
            <div className="h-6 bg-gray-100 rounded w-full" />
            <div className="h-6 bg-gray-100 rounded w-full" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-24 h-4 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[350] rounded-lg border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between"
      dir="rtl"
    >
      {/* هدر کارت */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">وضعیت دستگاه‌ها</h3>
      </div>

      {/* بخش اصلی: نمودار و راهنما */}
      <div className="flex items-center justify-between gap-4 my-2">
        {/* نمودار دونات */}
        <div className="relative w-[150] h-[150] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={devicesData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {devicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>


          {/* متن وسط نمودار */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 leading-none">
              {totalDevices.toLocaleString("fa-IR")}
            </span>
            <span className="text-[10px] font-bold text-gray-400 mt-1">
              دستگاه کل
            </span>
          </div>
        </div>

        {/* راهنمای سمت راست (Legend) */}
        <div className="flex flex-col gap-4">
          {devicesData.length > 0 ? (
            devicesData.map((item) => (
              <div key={item.name} className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-gray-400 mr-4.5">
                  ({item.value.toLocaleString("fa-IR")})
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400">دیتایی موجود نیست</span>
          )}
        </div>
      </div>

      {/* دکمه فوتر */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
        <Link
          href="/devices"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>مشاهده همه دستگاه‌ها</span>
          <ChevronLeft size={14} />
        </Link>
      </div>
    </div>
  );
}