"use client";
import React, { useMemo } from "react";
import { Database } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";
import useGetDeviceInventoryTransactions from "../hooks/useGetDeviceInventoryTransActions";

export default function InventoryTabChart() {
  const { deviceId } = useParams();
  const { deviceInventoryTransactions, isGettingDeviceInventoryTransactions } =
    useGetDeviceInventoryTransactions(deviceId as string);

  // تبدیل تاریخ میلادی به نام روزهای هفته فارسی
  const dayNames = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];

  const chartData = useMemo(() => {
    if (!deviceInventoryTransactions?.items) return [];

    const dailyTotals: Record<string, number> = {};
    const today = new Date();

    // ۱. ایجاد یک لیست از ۷ روز اخیر برای اینکه نمودار خالی نباشد
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0]; // فرمت YYYY-MM-DD
      dailyTotals[dateString] = 0;
    }

    // ۲. جمع زدن دلتاهای هر روز از دیتای دریافتی
    deviceInventoryTransactions.items.forEach((item: any) => {
      const dateString = item.created_at?.split("T")[0];
      if (dateString && dailyTotals.hasOwnProperty(dateString)) {
        dailyTotals[dateString] += item.delta;
      }
    });

    // ۳. تبدیل آبجکت به آرایه برای Recharts
    // مرتب کردن بر اساس تاریخ و تبدیل تاریخ به نام روز
    return Object.keys(dailyTotals)
      .sort()
      .map((dateStr) => {
        const dateObj = new Date(dateStr);
        // تبدیل روز هفته (0-6) به نام فارسی (با توجه به اینکه در JS یکشنبه 0 است)
        const dayIndex = dateObj.getUTCDay();
        return {
          day: dayNames[dayIndex],
          count: dailyTotals[dateStr],
        };
      });
  }, [deviceInventoryTransactions]);

  if (isGettingDeviceInventoryTransactions) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm p-6 h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-[200px] w-full bg-gray-50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 h-full">
        <div className="flex items-center gap-2 mb-6">
          <Database size={20} className="text-slate-400" />
          <h3 className="text-slate-700 font-bold text-base">
            روند تغییرات موجودی (۷ روز اخیر)
          </h3>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  direction: "rtl",
                }}
                // تغییر در تعریف ورودی‌ها برای رفع خطای تایپ اسکریپت
                formatter={(value: any, name: any) => [
                  `${value} واحد`,
                  "تغییرات",
                ]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorInventory)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
