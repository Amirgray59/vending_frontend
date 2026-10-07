"use client";

import React, { useMemo, useState } from "react";
import { Database } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";
import useGetDeviceInventoryTransactions from "../hooks/useGetDeviceInventoryTransActions";
import {
  getAllInventoryDeltaChartData,
  getDailyInventoryDeltaChartData,
} from "../utils/getInventoryPercentageChartData";

function formatInventoryDelta(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("fa-IR")}`;
}

export default function InventoryTabChart() {
  const [chartMode, setChartMode] = useState<"daily" | "all">("daily");
  const { deviceId } = useParams();
  const { deviceInventoryTransactions, isGettingDeviceInventoryTransactions } =
    useGetDeviceInventoryTransactions(deviceId as string);

  const chartData = useMemo(
    () => {
      const items = deviceInventoryTransactions?.items;

      return chartMode === "daily"
        ? getDailyInventoryDeltaChartData(items)
        : getAllInventoryDeltaChartData(items);
    },
    [chartMode, deviceInventoryTransactions],
  );
  const hasInventoryHistory = chartData.some(
    (item) => item.delta !== null,
  );

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
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
          <Database size={20} className="text-slate-400" />
          <h3 className="text-slate-700 font-bold text-base">
            {chartMode === "daily"
              ? "روند روزانه موجودی (۷ روز اخیر)"
              : "همهٔ تغییرات موجودی"}
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
          {!hasInventoryHistory ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
              {chartMode === "daily"
                ? "برای این بازه زمانی تغییری در موجودی ثبت نشده است."
                : "تغییری برای نمایش ثبت نشده است."}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
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
                  allowDecimals={false}
                  tickFormatter={(value: any) =>
                    Number(value).toLocaleString("fa-IR")
                  }
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    const point = payload?.[0]?.payload;
                    if (!active || !point) return null;

                    return (
                      <div className="rounded-xl border border-gray-100 bg-white p-3 text-right text-xs shadow-lg" dir="rtl">
                        <p className="mb-2 font-semibold text-slate-700">
                          {point.tooltipLabel ?? label}
                        </p>
                        <p className="text-emerald-600">
                          میزان تغییر: {formatInventoryDelta(point.delta)} عدد
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="delta"
                  name="میزان تغییر موجودی"
                  stroke="#10b981"
                  strokeWidth={3}
                  connectNulls
                  dot={chartMode === "all" ? { r: 3 } : false}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
