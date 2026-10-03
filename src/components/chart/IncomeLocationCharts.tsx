
"use client"
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// تعریف تایپ برای دیتا
interface ChartDataPoint {
  name: string;
  value: number;
}



export default function IncomeLocationChart({ chartData }: { chartData: ChartDataPoint[] }) {

  const formatYAxis = (value: number) => {
    if (value === 0) return "۰";
    return `${(value / 1000000).toLocaleString("fa-IR")}M`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-100 shadow-md rounded-lg dir-rtl text-right">
          <p className="text-xs font-bold text-gray-700">{payload[0].payload.name}</p>
          <p className="text-xs text-blue-600">{`درآمد: ${payload[0].value.toLocaleString("fa-IR")} تومان`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full border border-gray-100 bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-800">درآمد به تفکیک مکان</h3>
        
      </div>

      <div className="h-[300] w-full"> 

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="name"
              axisLine={true}
              tickLine={false}
              stroke="#ccc" 
              tick={{ fill: "#94A3B8", fontSize: 10 }}
              interval={0}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10, textAnchor: "end" }}
              tickFormatter={formatYAxis}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar dataKey="value" fill="#1D72F2" radius={[4, 4, 0, 0]} barSize={45}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#1D72F2" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <span className="text-sm font-bold text-gray-500">درآمد (تومان)</span>
        <div className="w-3 h-3 rounded-full bg-[#1D72F2]"></div>
      </div>
    </div>
  );
}


