
"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TrendDataPoint {
  date: string;
  value: number;
}

export default function IncomeTrendChart({ chartData }: { chartData: TrendDataPoint[] }) {
  const formatYAxis = (value: number) => {
    if (value === 0) return "۰";
    return `${(value / 1000000).toLocaleString("fa-IR")}M`;
  };

  return (
    <div className="w-full border bg-white border-gray-100 shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-bold text-gray-800">روند درآمد</h3>
        
      </div>

      <div className="h-[300] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D72F2" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1D72F2" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              axisLine={true}
              tickLine={false}
              stroke="#ccc"
              tick={{ fill: "#94A3B8", fontSize: 9 }}
              interval="preserveStartEnd"
              dy={15}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10, textAnchor: "end" }}
              tickFormatter={formatYAxis}
              dx={-10}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1D72F2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 3, fill: "#1D72F2", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        <span className="text-[10px] text-gray-500">درآمد (تومان)</span>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1D72F2] z-10"></div>
          <div className="w-6 h-[2] bg-[#1D72F2] -ml-1"></div>
        </div>
      </div>
    </div>
  );
}