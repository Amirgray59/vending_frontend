
"use client";

import React, { useState, useMemo } from "react";
import PageTitle from "@/components/shared/PageTitle";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, Box } from "lucide-react";
import useGetDeviceInventoryTransactions from "@/features/device-detail/hooks/useGetDeviceInventoryTransActions";
import DevicesAdvancedFilter from "@/features/devices/components/DeviceAdvancedFilter";
import { getInventoryPercentageChartData } from "@/features/device-detail/utils/getInventoryPercentageChartData";

export default function DevicesInventoryReportPage() {
  // --- استیت‌ها ---
  const initialFilters = {
    places: "all",
    sections: "all",
    deviceId: "all",
    sortOrder: "none", // مقدار اولیه برای مرتب‌سازی
  };
  const [filters, setFilterValues] = useState(initialFilters);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // --- دیتاها ---
  const { devicesList, isGettingDevicesList } = UseGetDevicesList();

  

  // گرفتن تراکنش‌های موجودی برای دستگاه انتخاب شده
  const { deviceInventoryTransactions, isGettingDeviceInventoryTransactions } =
    useGetDeviceInventoryTransactions(selectedDeviceId || "");

    console.log(deviceInventoryTransactions,selectedDeviceId);
    

  // --- منطق فیلترینگ و مرتب‌سازی دستگاه‌ها ---
  const filteredDevices = useMemo(() => {
    if (!devicesList?.items) return [];

    // ۱. ابتدا فیلتر کردن بر اساس مکان، بخش و ID دستگاه
    let result = devicesList.items.filter((device: any) => {
      const locationMatch =
        filters.places === "all" ||
        filters.places === "همه مجموعه ها" ||
        device.location_id === filters.places;
      const sectionMatch =
        filters.sections === "all" ||
        filters.sections === "همه بخش ها" ||
        device.section_id === filters.sections;
      const deviceMatch =
        filters.deviceId === "all" ||
        filters.deviceId === "همه دستگاه ها" ||
        device.id === filters.deviceId;
      return locationMatch && sectionMatch && deviceMatch;
    });

    // ۲. اعمال مرتب‌سازی بر اساس موجودی (inventory_level)
    if (filters.sortOrder === "desc") {
      // بیشترین موجودی به کمترین
      result = [...result].sort((a, b) => (b.inventory_level || 0) - (a.inventory_level || 0));
    } else if (filters.sortOrder === "asc") {
      // کمترین موجودی به بیشترین
      result = [...result].sort((a, b) => (a.inventory_level || 0) - (b.inventory_level || 0));
    }

    return result;
  }, [devicesList, filters]);

  // --- پردازش داده‌های تراکنش برای نمودار (تغییرات یک هفته اخیر) ---
  const selectedDevice = filteredDevices.find(
    (device: any) => device.id === selectedDeviceId,
  );
  const inventoryCapacity = selectedDevice?.inventory_capacity;
  const chartData = useMemo(
    () =>
      getInventoryPercentageChartData(
        deviceInventoryTransactions?.items,
        inventoryCapacity,
      ),
    [deviceInventoryTransactions, inventoryCapacity],
  );
  const hasCapacity =
    Number.isFinite(Number(inventoryCapacity)) && Number(inventoryCapacity) > 0;
  const hasInventoryHistory = chartData.some(
    (item) => item.percentage !== null,
  );

  if (isGettingDevicesList) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 animate-pulse">در حال بارگذاری لیست دستگاه‌ها...</p>
      </div>
    );
  }

  return (
    <section className="p-4" dir="rtl">
      <PageTitle
        title="گزارش تغییرات موجودی"
        description="داشبورد / گزارشات موجودی"
      />

      <DevicesAdvancedFilter
        className=""
        filterValues={filters}
        handleInputChange={(e: any) =>
          setFilterValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        onReset={() => setFilterValues(initialFilters)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* ستون راست: لیست دستگاه‌های فیلتر شده */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-[600px] p-2">
          <h3 className="text-sm font-bold text-gray-600 mb-4 px-2">
            انتخاب دستگاه برای مشاهده نمودار:
          </h3>
          {filteredDevices.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">دستگاهی یافت نشد.</div>
          ) : (
            filteredDevices.map((device: any) => (
              <div
                key={device.id}
                onClick={() => setSelectedDeviceId(device.id)}
                className={`p-3 cursor-pointer rounded-xl border transition-all flex items-center justify-between ${
                  selectedDeviceId === device.id
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                    : "bg-white border-gray-100 hover:border-blue-300 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Box size={18} className={selectedDeviceId === device.id ? "text-blue-600" : "text-gray-400"} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{device.name}</span>
                    <span className="text-[10px] opacity-70">{device.device_code}</span>
                    <span className="text-[10px] font-bold text-blue-500">موجودی: {device.inventory_level}</span>
                  </div>
                </div>
                {selectedDeviceId === device.id && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
            ))
          )}
        </div>

        {/* ستون چپ: نمایش نمودار و تحلیل */}
        <div className="lg:col-span-2">
          {!selectedDeviceId ? (
            <div className="bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center">
              <Box size={48} className="mb-3 opacity-20" />
              <p>لطفاً یک دستگاه را از لیست سمت راست انتخاب کنید تا تغییرات موجودی یک هفته اخیر نمایش داده شود.</p>
            </div>
          ) : (
            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-700">درصد موجودی هفته اخیر</h3>
                <div className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {filteredDevices.find((d: any) => d.id === selectedDeviceId)?.name}
                </div>
              </div>

              {isGettingDeviceInventoryTransactions ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : !hasCapacity ? (
                <div className="h-[400px] flex items-center justify-center px-6 text-center text-sm text-gray-500">
                  ابتدا ظرفیت موجودی دستگاه را در جزئیات آن وارد کنید تا نمودار درصدی نمایش داده شود.
                </div>
              ) : !hasInventoryHistory ? (
                <div className="h-[400px] flex items-center justify-center px-6 text-center text-sm text-gray-500">
                  برای این بازه زمانی سابقه‌ای از سطح موجودی ثبت نشده است.
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value: any) => String(value) + "%"}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          backgroundColor: "#fff",
                        }}
                        itemStyle={{ color: "#475569", fontSize: "12px" }}
                        labelStyle={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}
                        formatter={(value: any) => [
                          Number(value).toLocaleString("fa-IR", { maximumFractionDigits: 1 }) + "%",
                          "درصد موجودی",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563eb" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
