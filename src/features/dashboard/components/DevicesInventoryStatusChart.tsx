
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";

interface InventoryStatus {
  key: string;
  name: string;
  value: number;
  color: string;
}

const STATUS_CONFIG: Record<string, { name: string; color: string }> = {
  good: { name: "مناسب", color: "#22c55e" },
  yellow: { name: "هشدار", color: "#f59e0b" },
  red: { name: "بحرانی", color: "#ef4444" },
  empty: { name: "خالی", color: "#cbd5e1" },
};

export default function DevicesInventoryStatusChart() {
  const [mounted, setMounted] = useState(false);
  const { devicesList, isGettingDevicesList } = UseGetDevicesList();

  useEffect(() => {
    setMounted(true);
  }, []);

  // شمارش تعداد هر وضعیت موجودی از لیست دستگاه‌ها
  const inventoryData: InventoryStatus[] = React.useMemo(() => {
    if (!devicesList?.items || !Array.isArray(devicesList?.items)) return [];

    const counts: Record<string, number> = {};
    devicesList?.items?.forEach((device:any) => {
      const status = device.inventory_status;
      if (status) {
        counts[status] = (counts[status] || 0) + 1;
      }
    });

    return Object.entries(STATUS_CONFIG)
      .map(([key, config]) => ({
        key,
        name: config.name,
        value: counts[key] || 0,
        color: config.color,
      }))
      .filter((item) => item.value > 0);
  }, [devicesList?.items]);

  // کل دستگاه‌ها
  const totalDevices = devicesList?.items?.length || 0;

  // Skeleton
  if (!mounted || isGettingDevicesList) {
    return (
      <div className="w-full h-[350px] rounded-lg border border-gray-100 bg-white p-6 shadow-sm animate-pulse flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between gap-4 my-2">
          <div className="w-[150px] h-[150px] bg-gray-100 rounded-full" />
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
      className="w-full h-[350px] rounded-lg border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between"
      dir="rtl"
    >
      {/* هدر کارت */}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">وضعیت موجودی دستگاه‌ها</h3>
      </div>

      {/* بخش اصلی: نمودار و راهنما */}
      <div className="flex items-center justify-between gap-4 my-2">
        {/* نمودار دونات */}
        <div className="relative w-[150px] h-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {inventoryData.map((entry, index) => (
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

        {/* راهنما (Legend) */}
        <div className="flex flex-col gap-4">
          {inventoryData.length > 0 ? (
            inventoryData.map((item) => (
              <div key={item.key} className="flex items-start gap-2 flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
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