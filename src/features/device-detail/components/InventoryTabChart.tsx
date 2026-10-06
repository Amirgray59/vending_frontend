"use client";

import React, { useMemo, useState } from "react";
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
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import {
  getAllInventoryPercentageChangesChartData,
  getInventoryPercentageChartData,
} from "../utils/getInventoryPercentageChartData";

export default function InventoryTabChart() {
  const [chartMode, setChartMode] = useState<"daily" | "all">("daily");
  const { deviceId } = useParams();
  const { deviceInventoryTransactions, isGettingDeviceInventoryTransactions } =
    useGetDeviceInventoryTransactions(deviceId as string);
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);

  const chartData = useMemo(
    () => {
      const items = deviceInventoryTransactions?.items;
      const capacity = device?.inventory_capacity;

      return chartMode === "daily"
        ? getInventoryPercentageChartData(items, capacity)
        : getAllInventoryPercentageChangesChartData(items, capacity);
    },
    [chartMode, deviceInventoryTransactions, device?.inventory_capacity],
  );
  const hasCapacity =
    Number.isFinite(Number(device?.inventory_capacity)) &&
    Number(device?.inventory_capacity) > 0;
  const hasInventoryHistory = chartData.some(
    (item) => item.percentage !== null,
  );

  if (isGettingDeviceInventoryTransactions || isGettingDevice) {
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
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
          <Database size={20} className="text-slate-400" />
          <h3 className="text-slate-700 font-bold text-base">
            {chartMode === "daily"
              ? "روند روزانه درصد موجودی"
              : "درصد همه تغییرات موجودی"}
          </h3>
          <label className="flex items-center gap-2 text-sm text-slate-500 sm:mr-auto">
            <span>نمایش</span>
            <select
              aria-label="فیلتر روند موجودی"
              value={chartMode}
              onChange={(event) =>
                setChartMode(event.target.value as "daily" | "all")
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="daily">روند روزانه</option>
              <option value="all">همهٔ تغییرات</option>
            </select>
          </label>
        </div>
        <div className="h-[250px] w-full">
          {!hasCapacity ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
              ابتدا ظرفیت موجودی دستگاه را وارد کنید تا نمودار درصدی نمایش داده شود.
            </div>
          ) : !hasInventoryHistory ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
              {chartMode === "daily"
                ? "برای این بازه زمانی سابقه‌ای از سطح موجودی ثبت نشده است."
                : "تغییری برای نمایش ثبت نشده است."}
            </div>
          ) : (
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
                  interval={chartMode === "all" ? "preserveStartEnd" : 0}
                  minTickGap={24}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value: any) => String(value) + "%"}
                />
                <Tooltip
                  labelFormatter={(label: any, payload: any[]) =>
                    payload?.[0]?.payload?.tooltipLabel ?? label
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    direction: "rtl",
                  }}
                  formatter={(value: any) => [
                    Number(value).toLocaleString("fa-IR", { maximumFractionDigits: 1 }) + "%",
                    "درصد موجودی",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorInventory)"
                  connectNulls
                  dot={chartMode === "all" ? { r: 2, strokeWidth: 0 } : false}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
