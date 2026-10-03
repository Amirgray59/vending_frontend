"use client";

import React, { useState, useMemo } from "react";
import PageTitle from "@/components/shared/PageTitle";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useGetTransactions from "@/shared/hooks/useGetTransactions";
import FinancialAdvancedFilter from "@/features/devices/components/FinancialAdvancedFilter.";

export default function DevicesFinancialReportPage() {
  // ۱. اصلاح مقادیر اولیه برای پشتیبانی از فیلتر پله‌ای
  const initialFilters = {
    places: "all",
    sections: "all",
    deviceId: "all",
  };

  const [filters, setFilterValues] = useState(initialFilters);

  
  //   page: currentPage,
  //   size: pageSize,
  //   q: filters.search || "",
  //   location_id:
  //     filters.places === "all" || filters.places === "all_places"
  //       ? null
  //       : filters.places,
  //   section_id:
  //     filters.sections === "all" || filters.sections === "all_sections"
  //       ? null
  //       : filters.sections,
  //   status:
  //     filters.status === "all" || filters.status === "all_status"
  //       ? null
  //       : filters.status,
  //   connection: filters.alertType === "all_power" ? null : filters.alertType,
  //   inventory:
  //     filters.inventory === "all" || filters.inventory === "all_inventory"
  //       ? null
  //       : filters.inventory,
  //   // اگر فیلتر deviceId هم داری می‌توانی اینجا اضافه کنی
  // };

  const { devicesList, isGettingDevicesList } = UseGetDevicesList();
  const { transactions, isgettingTransactions } = useGetTransactions();


  // --- منطق فیلترینگ دستگاه‌ها بر اساس مجموعه، بخش و خودِ دستگاه ---
  const filteredDevices = useMemo(() => {
    if (!devicesList?.items) return [];
    return devicesList.items.filter((device: any) => {
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
  }, [devicesList, filters]);

  // --- محاسبه مجموع درآمدها بر اساس دستگاه‌های فیلتر شده ---
  const financialData = useMemo(() => {
    if (!transactions?.items) return [];

    const totalsMap: Record<string, number> = {};
    const deviceIdsSet = new Set(filteredDevices.map((d: any) => d.id));

    transactions.items.forEach((tx: any) => {
      if (deviceIdsSet.has(tx.device_id)) {
        totalsMap[tx.device_id] = (totalsMap[tx.device_id] || 0) + tx.price;
      }
    });

    return filteredDevices.map((device: any) => ({
      id: device.id,
      name: device.name,
      code: device.device_code,
      totalAmount: totalsMap[device.id] || 0,
    }));
  }, [transactions, filteredDevices]);

  if (isGettingDevicesList || isgettingTransactions) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">
          در حال تحلیل داده‌های مالی...
        </p>
      </div>
    );
  }

  return (
    <section className="p-4" dir="rtl">
      <PageTitle
        title="گزارش مالی دستگاه‌ها"
        description="داشبورد / گزارشات مالی"
      />

      <FinancialAdvancedFilter
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

      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* بخش نمودار میله‌ای */}
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-700">
              نمودار درآمد دستگاه‌های منتخب
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              تعداد دستگاه‌ها: {financialData.length}
            </span>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: any) => [
                    `${(value as number)?.toLocaleString() || 0} تومان`,
                    "درآمد کل",
                  ]}
                />
                <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                  {financialData.map((_: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* جدول جزئیات مالی */}
        <div className="bg-white p-4 border border-gray-100 shadow-sm rounded-lg overflow-x-auto">
          <table className="w-full text-right border-separate border-spacing-y-2">
            <thead className="text-gray-400 text-sm font-medium">
              <tr className="text-center">
                <th className="px-4 py-2">نام دستگاه</th>
                <th className="px-4 py-2">شناسه دستگاه</th>
                <th className="px-4 py-2">مجموع درآمد</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {financialData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 text-gray-400 italic border border-dashed border-gray-100 rounded-lg"
                  >
                    با فیلترهای انتخابی، هیچ دستگاهی یافت نشد.
                  </td>
                </tr>
              ) : (
                financialData.map((item: any) => (
                  <tr
                    key={item.id}
                    className="bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <td className="px-4 py-3 rounded-r-lg border-y border-r border-gray-100 text-slate-700 text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 border-y border-gray-100 text-slate-500 text-xs text-center">
                      {item.code}
                    </td>
                    <td className="px-4 py-3 rounded-l-lg border-y border-l border-gray-100 text-blue-600 font-bold text-sm text-center">
                      {item.totalAmount.toLocaleString()} تومان
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
